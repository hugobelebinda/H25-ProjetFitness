
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        if (node.parentNode) {
            node.parentNode.removeChild(node);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    let render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = /* @__PURE__ */ Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        // Do not reenter flush while dirty components are updated, as this can
        // result in an infinite loop. Instead, let the inner flush handle it.
        // Reentrancy is ok afterwards for bindings etc.
        if (flushidx !== 0) {
            return;
        }
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            try {
                while (flushidx < dirty_components.length) {
                    const component = dirty_components[flushidx];
                    flushidx++;
                    set_current_component(component);
                    update(component.$$);
                }
            }
            catch (e) {
                // reset dirty state to not end up in a deadlocked state and then rethrow
                dirty_components.length = 0;
                flushidx = 0;
                throw e;
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    /**
     * Useful for example to execute remaining `afterUpdate` callbacks before executing `destroy`.
     */
    function flush_render_callbacks(fns) {
        const filtered = [];
        const targets = [];
        render_callbacks.forEach((c) => fns.indexOf(c) === -1 ? filtered.push(c) : targets.push(c));
        targets.forEach((c) => c());
        render_callbacks = filtered;
    }
    const outroing = new Set();
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
                // if the component was destroyed immediately
                // it will update the `$$.on_destroy` reference to `null`.
                // the destructured on_destroy may still reference to the old array
                if (component.$$.on_destroy) {
                    component.$$.on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            flush_render_callbacks($$.after_update);
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: [],
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            if (!is_function(callback)) {
                return noop;
            }
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.59.2' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src\App.svelte generated by Svelte v3.59.2 */

    const file = "src\\App.svelte";

    function create_fragment(ctx) {
    	let div0;
    	let h2;
    	let t0;
    	let img0;
    	let img0_src_value;
    	let t1;
    	let a0;
    	let t3;
    	let a1;
    	let t5;
    	let a2;
    	let t7;
    	let a3;
    	let t9;
    	let a4;
    	let t11;
    	let div7;
    	let div3;
    	let div1;
    	let strong;
    	let t13;
    	let div2;
    	let a5;
    	let t15;
    	let section0;
    	let h1;
    	let img1;
    	let img1_src_value;
    	let t16;
    	let p0;
    	let t18;
    	let button;
    	let t20;
    	let section1;
    	let div4;
    	let img2;
    	let img2_src_value;
    	let t21;
    	let h30;
    	let t23;
    	let p1;
    	let t25;
    	let div5;
    	let img3;
    	let img3_src_value;
    	let t26;
    	let h31;
    	let t28;
    	let p2;
    	let t30;
    	let div6;
    	let img4;
    	let img4_src_value;
    	let t31;
    	let h32;
    	let t33;
    	let p3;

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			h2 = element("h2");
    			t0 = text("FIT4LIFE \n\t\t");
    			img0 = element("img");
    			t1 = space();
    			a0 = element("a");
    			a0.textContent = "Plan d'entraînement";
    			t3 = space();
    			a1 = element("a");
    			a1.textContent = "Plan nutritionnel";
    			t5 = space();
    			a2 = element("a");
    			a2.textContent = "Tableau de bord";
    			t7 = space();
    			a3 = element("a");
    			a3.textContent = "Suivi";
    			t9 = space();
    			a4 = element("a");
    			a4.textContent = "En savoir plus";
    			t11 = space();
    			div7 = element("div");
    			div3 = element("div");
    			div1 = element("div");
    			strong = element("strong");
    			strong.textContent = "FIT4LIFE";
    			t13 = space();
    			div2 = element("div");
    			a5 = element("a");
    			a5.textContent = "Inscription";
    			t15 = space();
    			section0 = element("section");
    			h1 = element("h1");
    			img1 = element("img");
    			t16 = space();
    			p0 = element("p");
    			p0.textContent = "Le site qui vous permettra de rester fit pour la vie!";
    			t18 = space();
    			button = element("button");
    			button.textContent = "Évaluation";
    			t20 = space();
    			section1 = element("section");
    			div4 = element("div");
    			img2 = element("img");
    			t21 = space();
    			h30 = element("h3");
    			h30.textContent = "Objectif Santé";
    			t23 = space();
    			p1 = element("p");
    			p1.textContent = "Améliore ton bien-être global grâce à des conseils sur la récupération, le sommeil et la gestion du stress.";
    			t25 = space();
    			div5 = element("div");
    			img3 = element("img");
    			t26 = space();
    			h31 = element("h3");
    			h31.textContent = "Objectif Fitness";
    			t28 = space();
    			p2 = element("p");
    			p2.textContent = "Atteins tes objectifs sportifs avec des programmes d'entraînement personnalisés et un suivi de tes performances.";
    			t30 = space();
    			div6 = element("div");
    			img4 = element("img");
    			t31 = space();
    			h32 = element("h3");
    			h32.textContent = "Objectif Nutrition";
    			t33 = space();
    			p3 = element("p");
    			p3.textContent = "Optimise ton alimentation avec des plans de repas équilibrés adaptés à ton style de vie et à tes besoins.";
    			if (!src_url_equal(img0.src, img0_src_value = "https://mail.google.com/mail/u/0?ui=2&ik=9e853468ec&attid=0.1&permmsgid=msg-a:r6906140957147156578&th=194d4e5453841c19&view=att&disp=safe&realattid=f_m6rk1zc80&zw")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "icon");
    			attr_dev(img0, "class", "svelte-1w74exj");
    			add_location(img0, file, 145, 2, 2473);
    			attr_dev(h2, "class", "svelte-1w74exj");
    			add_location(h2, file, 143, 4, 2454);
    			attr_dev(a0, "href", "#");
    			attr_dev(a0, "class", "svelte-1w74exj");
    			add_location(a0, file, 147, 4, 2672);
    			attr_dev(a1, "href", "#");
    			attr_dev(a1, "class", "svelte-1w74exj");
    			add_location(a1, file, 148, 4, 2712);
    			attr_dev(a2, "href", "#");
    			attr_dev(a2, "class", "svelte-1w74exj");
    			add_location(a2, file, 149, 1, 2747);
    			attr_dev(a3, "href", "#");
    			attr_dev(a3, "class", "svelte-1w74exj");
    			add_location(a3, file, 150, 1, 2780);
    			attr_dev(a4, "href", "#");
    			attr_dev(a4, "class", "svelte-1w74exj");
    			add_location(a4, file, 151, 4, 2806);
    			attr_dev(div0, "class", "sidebar svelte-1w74exj");
    			add_location(div0, file, 142, 0, 2428);
    			attr_dev(strong, "class", "svelte-1w74exj");
    			add_location(strong, file, 156, 13, 2905);
    			attr_dev(div1, "class", "svelte-1w74exj");
    			add_location(div1, file, 156, 8, 2900);
    			attr_dev(a5, "href", "#");
    			attr_dev(a5, "class", "svelte-1w74exj");
    			add_location(a5, file, 157, 13, 2950);
    			attr_dev(div2, "class", "svelte-1w74exj");
    			add_location(div2, file, 157, 8, 2945);
    			attr_dev(div3, "class", "header svelte-1w74exj");
    			add_location(div3, file, 155, 4, 2871);
    			if (!src_url_equal(img1.src, img1_src_value = "https://mail.google.com/mail/u/0?ui=2&ik=9e853468ec&attid=0.1&permmsgid=msg-a:r6906140957147156578&th=194d4e5453841c19&view=att&disp=safe&realattid=f_m6rk1zc80&zw")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "icon");
    			attr_dev(img1, "class", "svelte-1w74exj");
    			add_location(img1, file, 161, 12, 3041);
    			attr_dev(h1, "class", "svelte-1w74exj");
    			add_location(h1, file, 161, 8, 3037);
    			attr_dev(p0, "class", "svelte-1w74exj");
    			add_location(p0, file, 162, 8, 3240);
    			attr_dev(button, "class", "svelte-1w74exj");
    			add_location(button, file, 163, 8, 3309);
    			attr_dev(section0, "class", "midHeading svelte-1w74exj");
    			add_location(section0, file, 160, 4, 3000);
    			if (!src_url_equal(img2.src, img2_src_value = "https://www.freeiconspng.com/uploads/transparent-medical-doctor-background-logos-18.png")) attr_dev(img2, "src", img2_src_value);
    			attr_dev(img2, "alt", "icon");
    			attr_dev(img2, "class", "svelte-1w74exj");
    			add_location(img2, file, 168, 12, 3427);
    			attr_dev(h30, "class", "svelte-1w74exj");
    			add_location(h30, file, 169, 12, 3550);
    			attr_dev(p1, "class", "svelte-1w74exj");
    			add_location(p1, file, 170, 12, 3586);
    			attr_dev(div4, "class", "textInfo svelte-1w74exj");
    			add_location(div4, file, 167, 8, 3392);
    			if (!src_url_equal(img3.src, img3_src_value = "https://images.emojiterra.com/google/noto-emoji/unicode-15/color/512px/1f3cb-2642.png")) attr_dev(img3, "src", img3_src_value);
    			attr_dev(img3, "alt", "icon");
    			attr_dev(img3, "class", "svelte-1w74exj");
    			add_location(img3, file, 173, 12, 3759);
    			attr_dev(h31, "class", "svelte-1w74exj");
    			add_location(h31, file, 174, 12, 3880);
    			attr_dev(p2, "class", "svelte-1w74exj");
    			add_location(p2, file, 175, 12, 3918);
    			attr_dev(div5, "class", "textInfo svelte-1w74exj");
    			add_location(div5, file, 172, 8, 3724);
    			if (!src_url_equal(img4.src, img4_src_value = "https://static.thenounproject.com/png/583-200.png")) attr_dev(img4, "src", img4_src_value);
    			attr_dev(img4, "alt", "icon");
    			attr_dev(img4, "class", "svelte-1w74exj");
    			add_location(img4, file, 178, 12, 4096);
    			attr_dev(h32, "class", "svelte-1w74exj");
    			add_location(h32, file, 179, 12, 4181);
    			attr_dev(p3, "class", "svelte-1w74exj");
    			add_location(p3, file, 180, 12, 4221);
    			attr_dev(div6, "class", "textInfo svelte-1w74exj");
    			add_location(div6, file, 177, 8, 4061);
    			attr_dev(section1, "class", "sections svelte-1w74exj");
    			add_location(section1, file, 166, 4, 3357);
    			attr_dev(div7, "class", "content svelte-1w74exj");
    			add_location(div7, file, 154, 0, 2845);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, h2);
    			append_dev(h2, t0);
    			append_dev(h2, img0);
    			append_dev(div0, t1);
    			append_dev(div0, a0);
    			append_dev(div0, t3);
    			append_dev(div0, a1);
    			append_dev(div0, t5);
    			append_dev(div0, a2);
    			append_dev(div0, t7);
    			append_dev(div0, a3);
    			append_dev(div0, t9);
    			append_dev(div0, a4);
    			insert_dev(target, t11, anchor);
    			insert_dev(target, div7, anchor);
    			append_dev(div7, div3);
    			append_dev(div3, div1);
    			append_dev(div1, strong);
    			append_dev(div3, t13);
    			append_dev(div3, div2);
    			append_dev(div2, a5);
    			append_dev(div7, t15);
    			append_dev(div7, section0);
    			append_dev(section0, h1);
    			append_dev(h1, img1);
    			append_dev(section0, t16);
    			append_dev(section0, p0);
    			append_dev(section0, t18);
    			append_dev(section0, button);
    			append_dev(div7, t20);
    			append_dev(div7, section1);
    			append_dev(section1, div4);
    			append_dev(div4, img2);
    			append_dev(div4, t21);
    			append_dev(div4, h30);
    			append_dev(div4, t23);
    			append_dev(div4, p1);
    			append_dev(section1, t25);
    			append_dev(section1, div5);
    			append_dev(div5, img3);
    			append_dev(div5, t26);
    			append_dev(div5, h31);
    			append_dev(div5, t28);
    			append_dev(div5, p2);
    			append_dev(section1, t30);
    			append_dev(section1, div6);
    			append_dev(div6, img4);
    			append_dev(div6, t31);
    			append_dev(div6, h32);
    			append_dev(div6, t33);
    			append_dev(div6, p3);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t11);
    			if (detaching) detach_dev(div7);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let darkMode = true;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ darkMode });

    	$$self.$inject_state = $$props => {
    		if ('darkMode' in $$props) darkMode = $$props.darkMode;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    		name: 'world'
    	}
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
