import { DirtyableTag, combine, UpdatableReference, } from '@glimmer/reference';
import { keys, templateMeta, EMPTY_ARRAY, assign } from '@glimmer/util';
import { PrimitiveReference } from '@glimmer/runtime';
let GUID = 1;
export class EmberishCurlyComponent {
    constructor() {
        this.dirtinessTag = DirtyableTag.create();
        this.tagName = null;
        this.attributeBindings = null;
        this.parentView = null;
        this._guid = `${GUID++}`;
    }
    static create(args) {
        let c = new this();
        for (let key of keys(args)) {
            c[key] = args[key];
        }
        return c;
    }
    set(key, value) {
        this[key] = value;
    }
    setProperties(dict) {
        for (let key of keys(dict)) {
            this[key] = dict[key];
        }
        SELF_REF.get(this).dirty();
        this.dirtinessTag.inner.dirty();
    }
    recompute() {
        this.dirtinessTag.inner.dirty();
    }
    destroy() { }
    didInitAttrs(_options) { }
    didUpdateAttrs(_diff) { }
    didReceiveAttrs(_diff) { }
    willInsertElement() { }
    willUpdate() { }
    willRender() { }
    didInsertElement() { }
    didUpdate() { }
    didRender() { }
}
EmberishCurlyComponent.positionalParams = [];
const SELF_REF = new WeakMap();
export class EmberishCurlyComponentManager {
    getCapabilities(state) {
        return state.capabilities;
    }
    getAotStaticLayout(state, resolver) {
        return resolver.getInvocation(templateMeta(state.locator));
    }
    getJitDynamicLayout({ layout }, resolver, { program: { resolverDelegate } }) {
        if (!layout) {
            throw new Error('BUG: missing dynamic layout');
        }
        // TODO: What's going on with this weird resolve?
        let source = resolver.resolve(layout.handle);
        if (source === null) {
            throw new Error(`BUG: Missing dynamic layout for ${layout.name}`);
        }
        return resolverDelegate.compile(source, layout.name);
    }
    prepareArgs(state, args) {
        const { positionalParams } = state.ComponentClass || EmberishCurlyComponent;
        if (typeof positionalParams === 'string') {
            if (args.named.has(positionalParams)) {
                if (args.positional.length === 0) {
                    return null;
                }
                else {
                    throw new Error(`You cannot specify positional parameters and the hash argument \`${positionalParams}\`.`);
                }
            }
            let named = assign({}, args.named.capture().map);
            named[positionalParams] = args.positional.capture();
            return { positional: EMPTY_ARRAY, named };
        }
        else if (Array.isArray(positionalParams)) {
            let named = assign({}, args.named.capture().map);
            let count = Math.min(positionalParams.length, args.positional.length);
            for (let i = 0; i < count; i++) {
                let name = positionalParams[i];
                if (named[name]) {
                    throw new Error(`You cannot specify both a positional param (at position ${i}) and the hash argument \`${name}\`.`);
                }
                named[name] = args.positional.at(i);
            }
            return { positional: EMPTY_ARRAY, named };
        }
        else {
            return null;
        }
    }
    create(_environment, state, _args, dynamicScope, callerSelf, hasDefaultBlock) {
        let klass = state.ComponentClass || EmberishCurlyComponent;
        let self = callerSelf.value();
        let args = _args.named.capture();
        let attrs = args.value();
        let merged = assign({}, attrs, { attrs }, { args }, { targetObject: self }, { HAS_BLOCK: hasDefaultBlock });
        let component = klass.create(merged);
        component.name = state.name;
        component.args = args;
        if (state.layout !== null) {
            component.layout = { name: component.name, handle: state.layout };
        }
        let dyn = state.ComponentClass
            ? state.ComponentClass['fromDynamicScope'] || null
            : null;
        if (dyn) {
            for (let i = 0; i < dyn.length; i++) {
                let name = dyn[i];
                component.set(name, dynamicScope.get(name).value());
            }
        }
        component.didInitAttrs({ attrs });
        component.didReceiveAttrs({ oldAttrs: null, newAttrs: attrs });
        component.willInsertElement();
        component.willRender();
        return component;
    }
    getTag({ args: { tag }, dirtinessTag }) {
        return combine([tag, dirtinessTag]);
    }
    getSelf(component) {
        let ref = new UpdatableReference(component);
        SELF_REF.set(component, ref);
        return ref;
    }
    getTagName({ tagName }) {
        if (tagName) {
            return tagName;
        }
        else if (tagName === null) {
            return 'div';
        }
        else {
            return null;
        }
    }
    didCreateElement(component, element, operations) {
        component.element = element;
        operations.setAttribute('id', PrimitiveReference.create(`ember${component._guid}`), false, null);
        operations.setAttribute('class', PrimitiveReference.create('ember-view'), false, null);
        let bindings = component.attributeBindings;
        let rootRef = SELF_REF.get(component);
        if (bindings) {
            for (let i = 0; i < bindings.length; i++) {
                let attribute = bindings[i];
                let reference = rootRef.get(attribute);
                operations.setAttribute(attribute, reference, false, null);
            }
        }
    }
    didRenderLayout(component, bounds) {
        component.bounds = bounds;
    }
    didCreate(component) {
        component.didInsertElement();
        component.didRender();
    }
    update(component) {
        let oldAttrs = component.attrs;
        let newAttrs = component.args.value();
        let merged = assign({}, newAttrs, { attrs: newAttrs });
        component.setProperties(merged);
        component.didUpdateAttrs({ oldAttrs, newAttrs });
        component.didReceiveAttrs({ oldAttrs, newAttrs });
        component.willUpdate();
        component.willRender();
    }
    didUpdateLayout() { }
    didUpdate(component) {
        component.didUpdate();
        component.didRender();
    }
    getDestructor(component) {
        return {
            destroy() {
                component.destroy();
            },
        };
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW1iZXJpc2gtY3VybHkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9saWIvY29tcG9uZW50cy9lbWJlcmlzaC1jdXJseS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUF3QkEsT0FBTyxFQUVMLFlBQVksRUFFWixPQUFPLEVBQ1Asa0JBQWtCLEdBR25CLE1BQU0sb0JBQW9CLENBQUM7QUFDNUIsT0FBTyxFQUFFLElBQUksRUFBRSxZQUFZLEVBQUUsV0FBVyxFQUFFLE1BQU0sRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUV4RSxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQVV0RCxJQUFJLElBQUksR0FBRyxDQUFDLENBQUM7QUFFYixNQUFNLE9BQU8sc0JBQXNCO0lBMEJqQztRQXZCTyxpQkFBWSxHQUE2QixZQUFZLENBQUMsTUFBTSxFQUFFLENBQUM7UUFHL0QsWUFBTyxHQUFtQixJQUFJLENBQUM7UUFDL0Isc0JBQWlCLEdBQXFCLElBQUksQ0FBQztRQUkzQyxlQUFVLEdBQW1DLElBQUksQ0FBQztRQWdCdkQsSUFBSSxDQUFDLEtBQUssR0FBRyxHQUFHLElBQUksRUFBRSxFQUFFLENBQUM7SUFDM0IsQ0FBQztJQVpELE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBc0I7UUFDbEMsSUFBSSxDQUFDLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQztRQUVuQixLQUFLLElBQUksR0FBRyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUMxQixDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ3BCO1FBRUQsT0FBTyxDQUFDLENBQUM7SUFDWCxDQUFDO0lBTUQsR0FBRyxDQUFDLEdBQVcsRUFBRSxLQUFjO1FBQzVCLElBQWEsQ0FBQyxHQUFHLENBQUMsR0FBRyxLQUFLLENBQUM7SUFDOUIsQ0FBQztJQUVELGFBQWEsQ0FBQyxJQUFVO1FBQ3RCLEtBQUssSUFBSSxH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ZUFBZSxDQUFDLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUM7UUFDbEQsU0FBUyxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQ3ZCLFNBQVMsQ0FBQyxVQUFVLEVBQUUsQ0FBQztJQUN6QixDQUFDO0lBRUQsZUFBZSxLQUFVLENBQUM7SUFFMUIsU0FBUyxDQUFDLFNBQWlDO1FBQ3pDLFNBQVMsQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUN0QixTQUFTLENBQUMsU0FBUyxFQUFFLENBQUM7SUFDeEIsQ0FBQztJQUVELGFBQWEsQ0FBQyxTQUFpQztRQUM3QyxPQUFPO1lBQ0wsT0FBTztnQkFDTCxTQUFTLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDdEIsQ0FBQztTQUNGLENBQUM7SUFDSixDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBPcHRpb24sXG4gIENhcHR1cmVkTmFtZWRBcmd1bWVudHMsXG4gIEJvdW5kcyxcbiAgV2l0aER5bmFtaWNUYWdOYW1lLFxuICBKaXRSdW50aW1lUmVzb2x2ZXIsXG4gIFdpdGhKaXREeW5hbWljTGF5b3V0LFxuICBXaXRoQW90U3RhdGljTGF5b3V0LFxuICBNb2R1bGVMb2NhdG9yLFxuICBQcm9ncmFtU3ltYm9sVGFibGUsXG4gIEFvdFJ1bnRpbWVSZXNvbHZlcixcbiAgSW52b2NhdGlvbixcbiAgU3ludGF4Q29tcGlsYXRpb25Db250ZXh0LFxuICBUZW1wbGF0ZSxcbiAgVk1Bcmd1bWVudHMsXG4gIFByZXBhcmVkQXJndW1lbnRzLFxuICBFbnZpcm9ubWVudCxcbiAgRHluYW1pY1Njb3BlLFxuICBFbGVtZW50T3BlcmF0aW9ucyxcbiAgRGVzdHJveWFibGUsXG4gIERpY3QsXG4gIENvbXBvbmVudENhcGFiaWxpdGllcyxcbn0gZnJvbSAnQGdsaW1tZXIvaW50ZXJmYWNlcyc7XG5pbXBvcnQgeyBBdHRycywgQXR0cnNEaWZmIH0gZnJvbSAnLi9lbWJlcmlzaC1nbGltbWVyJztcbmltcG9ydCB7XG4gIFRhZ1dyYXBwZXIsXG4gIERpcnR5YWJsZVRhZyxcbiAgVmVyc2lvbmVkUGF0aFJlZmVyZW5jZSxcbiAgY29tYmluZSxcbiAgVXBkYXRhYmxlUmVmZXJlbmNlLFxuICBQYXRoUmVmZXJlbmNlLFxuICBUYWcsXG59IGZyb20gJ0BnbGltbWVyL3JlZmVyZW5jZSc7XG5pbXBvcnQgeyBrZXlzLCB0ZW1wbGF0ZU1ldGEsIEVNUFRZX0FSUkFZLCBhc3NpZ24gfSBmcm9tICdAZ2xpbW1lci91dGlsJztcbmltcG9ydCB7IFRlc3RDb21wb25lbnREZWZpbml0aW9uU3RhdGUgfSBmcm9tICcuL3Rlc3QtY29tcG9uZW50JztcbmltcG9ydCB7IFByaW1pdGl2ZVJlZmVyZW5jZSB9IGZyb20gJ0BnbGltbWVyL3J1bnRpbWUnO1xuaW1wb3J0IHsgVGVzdENvbXBvbmVudENvbnN0cnVjdG9yIH0gZnJvbSAnLi90eXBlcyc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgRW1iZXJpc2hDdXJseUNvbXBvbmVudEZhY3RvcnlcbiAgZXh0ZW5kcyBUZXN0Q29tcG9uZW50Q29uc3RydWN0b3I8RW1iZXJpc2hDdXJseUNvbXBvbmVudD4ge1xuICBmcm9tRHluYW1pY1Njb3BlPzogc3RyaW5nW107XG4gIHBvc2l0aW9uYWxQYXJhbXM6IE9wdGlvbjxzdHJpbmcgfCBzdHJpbmdbXT47XG4gIGNyZWF0ZShvcHRpb25zOiB7IGF0dHJzOiBBdHRyczsgdGFyZ2V0T2JqZWN0OiBhbnkgfSk6IEVtYmVyaXNoQ3VybHlDb21wb25lbnQ7XG59XG5cbmxldCBHVUlEID0gMTtcblxuZXhwb3J0IGNsYXNzIEVtYmVyaXNoQ3VybHlDb21wb25lbnQge1xuICBwdWJsaWMgc3RhdGljIHBvc2l0aW9uYWxQYXJhbXM6IHN0cmluZ1tdIHwgc3RyaW5nID0gW107XG5cbiAgcHVibGljIGRpcnRpbmVzc1RhZzogVGFnV3JhcHBlcjxEaXJ0eWFibGVUYWc+ID0gRGlydHlhYmxlVGFnLmNyZWF0ZSgpO1xuICBwdWJsaWMgbGF5b3V0ITogeyBuYW1lOiBzdHJpbmc7IGhhbmRsZTogbnVtYmVyIH07XG4gIHB1YmxpYyBuYW1lITogc3RyaW5nO1xuICBwdWJsaWMgdGFnTmFtZTogT3B0aW9uPHN0cmluZz4gPSBudWxsO1xuICBwdWJsaWMgYXR0cmlidXRlQmluZGluZ3M6IE9wdGlvbjxzdHJpbmdbXT4gPSBudWxsO1xuICBwdWJsaWMgYXR0cnMhOiBBdHRycztcbiAgcHVibGljIGVsZW1lbnQhOiBFbGVtZW50O1xuICBwdWJsaWMgYm91bmRzITogQm91bmRzO1xuICBwdWJsaWMgcGFyZW50VmlldzogT3B0aW9uPEVtYmVyaXNoQ3VybHlDb21wb25lbnQ+ID0gbnVsbDtcbiAgcHVibGljIGFyZ3MhOiBDYXB0dXJlZE5hbWVkQXJndW1lbnRzO1xuXG4gIHB1YmxpYyBfZ3VpZDogc3RyaW5nO1xuXG4gIHN0YXRpYyBjcmVhdGUoYXJnczogeyBhdHRyczogQXR0cnMgfSk6IEVtYmVyaXNoQ3VybHlDb21wb25lbnQge1xuICAgIGxldCBjID0gbmV3IHRoaXMoKTtcblxuICAgIGZvciAobGV0IGtleSBvZiBrZXlzKGFyZ3MpKSB7XG4gICAgICBjW2tleV0gPSBhcmdzW2tleV07XG4gICAgfVxuXG4gICAgcmV0dXJuIGM7XG4gIH1cblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLl9ndWlkID0gYCR7R1VJRCsrfWA7XG4gIH1cblxuICBzZXQoa2V5OiBzdHJpbmcsIHZhbHVlOiB1bmtub3duKSB7XG4gICAgKHRoaXMgYXMgRGljdClba2V5XSA9IHZhbHVlO1xuICB9XG5cbiAgc2V0UHJvcGVydGllcyhkaWN0OiBEaWN0KSB7XG4gICAgZm9yIChsZXQga2V5IG9mIGtleXMoZGljdCkpIHtcbiAgICAgICh0aGlzIGFzIERpY3QpW2tleV0gPSBkaWN0W2tleV07XG4gICAgfVxuXG4gICAgU0VMRl9SRUYuZ2V0KHRoaXMpIS5kaXJ0eSgpO1xuICAgIHRoaXMuZGlydGluZXNzVGFnLmlubmVyLmRpcnR5KCk7XG4gIH1cblxuICByZWNvbXB1dGUoKSB7XG4gICAgdGhpcy5kaXJ0aW5lc3NUYWcuaW5uZXIuZGlydHkoKTtcbiAgfVxuXG4gIGRlc3Ryb3koKSB7fVxuXG4gIGRpZEluaXRBdHRycyhfb3B0aW9uczogeyBhdHRyczogQXR0cnMgfSkge31cbiAgZGlkVXBkYXRlQXR0cnMoX2RpZmY6IEF0dHJzRGlmZikge31cbiAgZGlkUmVjZWl2ZUF0dHJzKF9kaWZmOiBBdHRyc0RpZmYpIHt9XG4gIHdpbGxJbnNlcnRFbGVtZW50KCkge31cbiAgd2lsbFVwZGF0ZSgpIHt9XG4gIHdpbGxSZW5kZXIoKSB7fVxuICBkaWRJbnNlcnRFbGVtZW50KCkge31cbiAgZGlkVXBkYXRlKCkge31cbiAgZGlkUmVuZGVyKCkge31cbn1cblxuY29uc3QgU0VMRl9SRUYgPSBuZXcgV2Vha01hcDxvYmplY3QsIFVwZGF0YWJsZVJlZmVyZW5jZT4oKTtcblxuZXhwb3J0IGludGVyZmFjZSBFbWJlcmlzaEN1cmx5Q29tcG9uZW50RGVmaW5pdGlvblN0YXRlIHtcbiAgbmFtZTogc3RyaW5nO1xuICBDb21wb25lbnRDbGFzczogRW1iZXJpc2hDdXJseUNvbXBvbmVudEZhY3Rvcnk7XG4gIGxvY2F0b3I6IE1vZHVsZUxvY2F0b3I7XG4gIGxheW91dDogT3B0aW9uPG51bWJlcj47XG4gIHN5bWJvbFRhYmxlPzogUHJvZ3JhbVN5bWJvbFRhYmxlO1xufVxuXG5leHBvcnQgY2xhc3MgRW1iZXJpc2hDdXJseUNvbXBvbmVudE1hbmFnZXJcbiAgaW1wbGVtZW50c1xuICAgIFdpdGhEeW5hbWljVGFnTmFtZTxFbWJlcmlzaEN1cmx5Q29tcG9uZW50PixcbiAgICBXaXRoSml0RHluYW1pY0xheW91dDxFbWJlcmlzaEN1cmx5Q29tcG9uZW50LCBKaXRSdW50aW1lUmVzb2x2ZXI+LFxuICAgIFdpdGhBb3RTdGF0aWNMYXlvdXQ8XG4gICAgICBFbWJlcmlzaEN1cmx5Q29tcG9uZW50LFxuICAgICAgRW1iZXJpc2hDdXJseUNvbXBvbmVudERlZmluaXRpb25TdGF0ZSxcbiAgICAgIEFvdFJ1bnRpbWVSZXNvbHZlclxuICAgID4ge1xuICBnZXRDYXBhYmlsaXRpZXMoc3RhdGU6IFRlc3RDb21wb25lbnREZWZpbml0aW9uU3RhdGUpOiBDb21wb25lbnRDYXBhYmlsaXRpZXMge1xuICAgIHJldHVybiBzdGF0ZS5jYXBhYmlsaXRpZXM7XG4gIH1cblxuICBnZXRBb3RTdGF0aWNMYXlvdXQoXG4gICAgc3RhdGU6IEVtYmVyaXNoQ3VybHlDb21wb25lbnREZWZpbml0aW9uU3RhdGUsXG4gICAgcmVzb2x2ZXI6IEFvdFJ1bnRpbWVSZXNvbHZlclxuICApOiBJbnZvY2F0aW9uIHtcbiAgICByZXR1cm4gcmVzb2x2ZXIuZ2V0SW52b2NhdGlvbih0ZW1wbGF0ZU1ldGEoc3RhdGUubG9jYXRvcikpO1xuICB9XG5cbiAgZ2V0Sml0RHluYW1pY0xheW91dChcbiAgICB7IGxheW91dCB9OiBFbWJlcmlzaEN1cmx5Q29tcG9uZW50LFxuICAgIHJlc29sdmVyOiBKaXRSdW50aW1lUmVzb2x2ZXIsXG4gICAgeyBwcm9ncmFtOiB7IHJlc29sdmVyRGVsZWdhdGUgfSB9OiBTeW50YXhDb21waWxhdGlvbkNvbnRleHRcbiAgKTogVGVtcGxhdGUge1xuICAgIGlmICghbGF5b3V0KSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0JVRzogbWlzc2luZyBkeW5hbWljIGxheW91dCcpO1xuICAgIH1cblxuICAgIC8vIFRPRE86IFdoYXQncyBnb2luZyBvbiB3aXRoIHRoaXMgd2VpcmQgcmVzb2x2ZT9cbiAgICBsZXQgc291cmNlID0gKHJlc29sdmVyLnJlc29sdmUobGF5b3V0LmhhbmRsZSkgYXMgdW5rbm93bikgYXMgc3RyaW5nO1xuXG4gICAgaWYgKHNvdXJjZSA9PT0gbnVsbCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBCVUc6IE1pc3NpbmcgZHluYW1pYyBsYXlvdXQgZm9yICR7bGF5b3V0Lm5hbWV9YCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc29sdmVyRGVsZWdhdGUuY29tcGlsZShzb3VyY2UsIGxheW91dC5uYW1lKTtcbiAgfVxuXG4gIHByZXBhcmVBcmdzKFxuICAgIHN0YXRlOiBFbWJlcmlzaEN1cmx5Q29tcG9uZW50RGVmaW5pdGlvblN0YXRlLFxuICAgIGFyZ3M6IFZNQXJndW1lbnRzXG4gICk6IE9wdGlvbjxQcmVwYXJlZEFyZ3VtZW50cz4ge1xuICAgIGNvbnN0IHsgcG9zaXRpb25hbFBhcmFtcyB9ID0gc3RhdGUuQ29tcG9uZW50Q2xhc3MgfHwgRW1iZXJpc2hDdXJseUNvbXBvbmVudDtcblxuICAgIGlmICh0eXBlb2YgcG9zaXRpb25hbFBhcmFtcyA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGlmIChhcmdzLm5hbWVkLmhhcyhwb3NpdGlvbmFsUGFyYW1zKSkge1xuICAgICAgICBpZiAoYXJncy5wb3NpdGlvbmFsLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAgIGBZb3UgY2Fubm90IHNwZWNpZnkgcG9zaXRpb25hbCBwYXJhbWV0ZXJzIGFuZCB0aGUgaGFzaCBhcmd1bWVudCBcXGAke3Bvc2l0aW9uYWxQYXJhbXN9XFxgLmBcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGxldCBuYW1lZCA9IGFzc2lnbih7fSwgYXJncy5uYW1lZC5jYXB0dXJlKCkubWFwKTtcbiAgICAgIG5hbWVkW3Bvc2l0aW9uYWxQYXJhbXNdID0gYXJncy5wb3NpdGlvbmFsLmNhcHR1cmUoKTtcblxuICAgICAgcmV0dXJuIHsgcG9zaXRpb25hbDogRU1QVFlfQVJSQVksIG5hbWVkIH07XG4gICAgfSBlbHNlIGlmIChBcnJheS5pc0FycmF5KHBvc2l0aW9uYWxQYXJhbXMpKSB7XG4gICAgICBsZXQgbmFtZWQgPSBhc3NpZ24oe30sIGFyZ3MubmFtZWQuY2FwdHVyZSgpLm1hcCk7XG4gICAgICBsZXQgY291bnQgPSBNYXRoLm1pbihwb3NpdGlvbmFsUGFyYW1zLmxlbmd0aCwgYXJncy5wb3NpdGlvbmFsLmxlbmd0aCk7XG5cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY291bnQ7IGkrKykge1xuICAgICAgICBsZXQgbmFtZSA9IHBvc2l0aW9uYWxQYXJhbXNbaV07XG5cbiAgICAgICAgaWYgKG5hbWVkW25hbWVdKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICAgYFlvdSBjYW5ub3Qgc3BlY2lmeSBib3RoIGEgcG9zaXRpb25hbCBwYXJhbSAoYXQgcG9zaXRpb24gJHtpfSkgYW5kIHRoZSBoYXNoIGFyZ3VtZW50IFxcYCR7bmFtZX1cXGAuYFxuICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICBuYW1lZFtuYW1lXSA9IGFyZ3MucG9zaXRpb25hbC5hdChpKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHsgcG9zaXRpb25hbDogRU1QVFlfQVJSQVksIG5hbWVkIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfVxuXG4gIGNyZWF0ZShcbiAgICBfZW52aXJvbm1lbnQ6IEVudmlyb25tZW50LFxuICAgIHN0YXRlOiBFbWJlcmlzaEN1cmx5Q29tcG9uZW50RGVmaW5pdGlvblN0YXRlLFxuICAgIF9hcmdzOiBWTUFyZ3VtZW50cyxcbiAgICBkeW5hbWljU2NvcGU6IER5bmFtaWNTY29wZSxcbiAgICBjYWxsZXJTZWxmOiBWZXJzaW9uZWRQYXRoUmVmZXJlbmNlLFxuICAgIGhhc0RlZmF1bHRCbG9jazogYm9vbGVhblxuICApOiBFbWJlcmlzaEN1cmx5Q29tcG9uZW50IHtcbiAgICBsZXQga2xhc3MgPSBzdGF0ZS5Db21wb25lbnRDbGFzcyB8fCBFbWJlcmlzaEN1cmx5Q29tcG9uZW50O1xuICAgIGxldCBzZWxmID0gY2FsbGVyU2VsZi52YWx1ZSgpO1xuICAgIGxldCBhcmdzID0gX2FyZ3MubmFtZWQuY2FwdHVyZSgpO1xuICAgIGxldCBhdHRycyA9IGFyZ3MudmFsdWUoKTtcbiAgICBsZXQgbWVyZ2VkID0gYXNzaWduKFxuICAgICAge30sXG4gICAgICBhdHRycyxcbiAgICAgIHsgYXR0cnMgfSxcbiAgICAgIHsgYXJncyB9LFxuICAgICAgeyB0YXJnZXRPYmplY3Q6IHNlbGYgfSxcbiAgICAgIHsgSEFTX0JMT0NLOiBoYXNEZWZhdWx0QmxvY2sgfVxuICAgICk7XG4gICAgbGV0IGNvbXBvbmVudCA9IGtsYXNzLmNyZWF0ZShtZXJnZWQpO1xuXG4gICAgY29tcG9uZW50Lm5hbWUgPSBzdGF0ZS5uYW1lO1xuICAgIGNvbXBvbmVudC5hcmdzID0gYXJncztcblxuICAgIGlmIChzdGF0ZS5sYXlvdXQgIT09IG51bGwpIHtcbiAgICAgIGNvbXBvbmVudC5sYXlvdXQgPSB7IG5hbWU6IGNvbXBvbmVudC5uYW1lLCBoYW5kbGU6IHN0YXRlLmxheW91dCB9O1xuICAgIH1cblxuICAgIGxldCBkeW46IE9wdGlvbjxzdHJpbmdbXT4gPSBzdGF0ZS5Db21wb25lbnRDbGFzc1xuICAgICAgPyBzdGF0ZS5Db21wb25lbnRDbGFzc1snZnJvbUR5bmFtaWNTY29wZSddIHx8IG51bGxcbiAgICAgIDogbnVsbDtcblxuICAgIGlmIChkeW4pIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZHluLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGxldCBuYW1lID0gZHluW2ldO1xuICAgICAgICBjb21wb25lbnQuc2V0KG5hbWUsIGR5bmFtaWNTY29wZS5nZXQobmFtZSkudmFsdWUoKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29tcG9uZW50LmRpZEluaXRBdHRycyh7IGF0dHJzIH0pO1xuICAgIGNvbXBvbmVudC5kaWRSZWNlaXZlQXR0cnMoeyBvbGRBdHRyczogbnVsbCwgbmV3QXR0cnM6IGF0dHJzIH0pO1xuICAgIGNvbXBvbmVudC53aWxsSW5zZXJ0RWxlbWVudCgpO1xuICAgIGNvbXBvbmVudC53aWxsUmVuZGVyKCk7XG5cbiAgICByZXR1cm4gY29tcG9uZW50O1xuICB9XG5cbiAgZ2V0VGFnKHsgYXJnczogeyB0YWcgfSwgZGlydGluZXNzVGFnIH06IEVtYmVyaXNoQ3VybHlDb21wb25lbnQpOiBUYWcge1xuICAgIHJldHVybiBjb21iaW5lKFt0YWcsIGRpcnRpbmVzc1RhZ10pO1xuICB9XG5cbiAgZ2V0U2VsZihjb21wb25lbnQ6IEVtYmVyaXNoQ3VybHlDb21wb25lbnQpOiBQYXRoUmVmZXJlbmNlPHVua25vd24+IHtcbiAgICBsZXQgcmVmID0gbmV3IFVwZGF0YWJsZVJlZmVyZW5jZShjb21wb25lbnQpO1xuICAgIFNFTEZfUkVGLnNldChjb21wb25lbnQsIHJlZik7XG4gICAgcmV0dXJuIHJlZjtcbiAgfVxuXG4gIGdldFRhZ05hbWUoeyB0YWdOYW1lIH06IEVtYmVyaXNoQ3VybHlDb21wb25lbnQpOiBPcHRpb248c3RyaW5nPiB7XG4gICAgaWYgKHRhZ05hbWUpIHtcbiAgICAgIHJldHVybiB0YWdOYW1lO1xuICAgIH0gZWxzZSBpZiAodGFnTmFtZSA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuICdkaXYnO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gIH1cblxuICBkaWRDcmVhdGVFbGVtZW50KFxuICAgIGNvbXBvbmVudDogRW1iZXJpc2hDdXJseUNvbXBvbmVudCxcbiAgICBlbGVtZW50OiBFbGVtZW50LFxuICAgIG9wZXJhdGlvbnM6IEVsZW1lbnRPcGVyYXRpb25zXG4gICk6IHZvaWQge1xuICAgIGNvbXBvbmVudC5lbGVtZW50ID0gZWxlbWVudDtcblxuICAgIG9wZXJhdGlvbnMuc2V0QXR0cmlidXRlKFxuICAgICAgJ2lkJyxcbiAgICAgIFByaW1pdGl2ZVJlZmVyZW5jZS5jcmVhdGUoYGVtYmVyJHtjb21wb25lbnQuX2d1aWR9YCksXG4gICAgICBmYWxzZSxcbiAgICAgIG51bGxcbiAgICApO1xuICAgIG9wZXJhdGlvbnMuc2V0QXR0cmlidXRlKCdjbGFzcycsIFByaW1pdGl2ZVJlZmVyZW5jZS5jcmVhdGUoJ2VtYmVyLXZpZXcnKSwgZmFsc2UsIG51bGwpO1xuXG4gICAgbGV0IGJpbmRpbmdzID0gY29tcG9uZW50LmF0dHJpYnV0ZUJpbmRpbmdzO1xuICAgIGxldCByb290UmVmID0gU0VMRl9SRUYuZ2V0KGNvbXBvbmVudCkhO1xuXG4gICAgaWYgKGJpbmRpbmdzKSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGJpbmRpbmdzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGxldCBhdHRyaWJ1dGUgPSBiaW5kaW5nc1tpXTtcbiAgICAgICAgbGV0IHJlZmVyZW5jZSA9IHJvb3RSZWYuZ2V0KGF0dHJpYnV0ZSkgYXMgUGF0aFJlZmVyZW5jZTxzdHJpbmc+O1xuXG4gICAgICAgIG9wZXJhdGlvbnMuc2V0QXR0cmlidXRlKGF0dHJpYnV0ZSwgcmVmZXJlbmNlLCBmYWxzZSwgbnVsbCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZGlkUmVuZGVyTGF5b3V0KGNvbXBvbmVudDogRW1iZXJpc2hDdXJseUNvbXBvbmVudCwgYm91bmRzOiBCb3VuZHMpOiB2b2lkIHtcbiAgICBjb21wb25lbnQuYm91bmRzID0gYm91bmRzO1xuICB9XG5cbiAgZGlkQ3JlYXRlKGNvbXBvbmVudDogRW1iZXJpc2hDdXJseUNvbXBvbmVudCk6IHZvaWQge1xuICAgIGNvbXBvbmVudC5kaWRJbnNlcnRFbGVtZW50KCk7XG4gICAgY29tcG9uZW50LmRpZFJlbmRlcigpO1xuICB9XG5cbiAgdXBkYXRlKGNvbXBvbmVudDogRW1iZXJpc2hDdXJseUNvbXBvbmVudCk6IHZvaWQge1xuICAgIGxldCBvbGRBdHRycyA9IGNvbXBvbmVudC5hdHRycztcbiAgICBsZXQgbmV3QXR0cnMgPSBjb21wb25lbnQuYXJncy52YWx1ZSgpO1xuICAgIGxldCBtZXJnZWQgPSBhc3NpZ24oe30sIG5ld0F0dHJzLCB7IGF0dHJzOiBuZXdBdHRycyB9KTtcblxuICAgIGNvbXBvbmVudC5zZXRQcm9wZXJ0aWVzKG1lcmdlZCk7XG4gICAgY29tcG9uZW50LmRpZFVwZGF0ZUF0dHJzKHsgb2xkQXR0cnMsIG5ld0F0dHJzIH0pO1xuICAgIGNvbXBvbmVudC5kaWRSZWNlaXZlQXR0cnMoeyBvbGRBdHRycywgbmV3QXR0cnMgfSk7XG4gICAgY29tcG9uZW50LndpbGxVcGRhdGUoKTtcbiAgICBjb21wb25lbnQud2lsbFJlbmRlcigpO1xuICB9XG5cbiAgZGlkVXBkYXRlTGF5b3V0KCk6IHZvaWQge31cblxuICBkaWRVcGRhdGUoY29tcG9uZW50OiBFbWJlcmlzaEN1cmx5Q29tcG9uZW50KTogdm9pZCB7XG4gICAgY29tcG9uZW50LmRpZFVwZGF0ZSgpO1xuICAgIGNvbXBvbmVudC5kaWRSZW5kZXIoKTtcbiAgfVxuXG4gIGdldERlc3RydWN0b3IoY29tcG9uZW50OiBFbWJlcmlzaEN1cmx5Q29tcG9uZW50KTogRGVzdHJveWFibGUge1xuICAgIHJldHVybiB7XG4gICAgICBkZXN0cm95KCkge1xuICAgICAgICBjb21wb25lbnQuZGVzdHJveSgpO1xuICAgICAgfSxcbiAgICB9O1xuICB9XG59XG4iXX0=