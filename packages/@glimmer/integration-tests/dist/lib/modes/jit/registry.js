import { dict } from '@glimmer/util';
import { createTemplate } from '../../compile';
export class TypedRegistry {
    constructor() {
        this.byName = dict();
        this.byHandle = dict();
    }
    hasName(name) {
        return name in this.byName;
    }
    getHandle(name) {
        return this.byName[name];
    }
    hasHandle(name) {
        return name in this.byHandle;
    }
    getByHandle(handle) {
        return this.byHandle[handle];
    }
    register(handle, name, value) {
        this.byHandle[handle] = value;
        this.byName[name] = handle;
    }
}
export default class Registry {
    constructor() {
        this.helper = new TypedRegistry();
        this.modifier = new TypedRegistry();
        this.partial = new TypedRegistry();
        this.component = new TypedRegistry();
        this.template = new TypedRegistry();
        this.compilable = new TypedRegistry();
        this['template-source'] = new TypedRegistry();
    }
}
export class TestJitRegistry {
    constructor() {
        this.handleLookup = [];
        this.registry = new Registry();
    }
    register(type, name, value) {
        let registry = this.registry[type];
        let handle = this.handleLookup.length;
        this.handleLookup.push(registry);
        this.registry[type].register(handle, name, value);
        return handle;
    }
    customCompilableTemplate(sourceHandle, templateName, create) {
        let compilableHandle = this.lookup('compilable', templateName);
        if (compilableHandle) {
            return this.resolve(compilableHandle);
        }
        let source = this.resolve(sourceHandle);
        let compilable = create(source);
        this.register('compilable', templateName, compilable);
        return compilable;
    }
    templateFromSource(source, templateName, create) {
        let compilableHandle = this.lookup('compilable', templateName);
        if (compilableHandle) {
            return this.resolve(compilableHandle);
        }
        let template = create(source);
        this.register('compilable', templateName, template);
        return template;
    }
    compileTemplate(sourceHandle, templateName, create) {
        let invocationHandle = this.lookup('template', templateName);
        if (invocationHandle) {
            return this.resolve(invocationHandle);
        }
        let source = this.resolve(sourceHandle);
        let invocation = create(source);
        this.register('template', templateName, invocation);
        return invocation;
    }
    lookup(type, name, _referrer) {
        if (this.registry[type].hasName(name)) {
            return this.registry[type].getHandle(name);
        }
        else {
            return null;
        }
    }
    lookupComponentHandle(name, referrer) {
        return this.lookup('component', name, referrer);
    }
    getCapabilities(handle) {
        let definition = this.resolve(handle);
        let { manager, state } = definition;
        return manager.getCapabilities(state);
    }
    lookupCompileTimeComponent(name, referrer) {
        let definitionHandle = this.lookupComponentHandle(name, referrer);
        if (definitionHandle === null) {
            return null;
        }
        let templateHandle = this.lookup('template-source', name, null);
        if (templateHandle === null) {
            throw new Error('BUG: missing dynamic layout');
        }
        // TODO: This whole thing probably should have a more first-class
        // structure.
        let template = this.customCompilableTemplate(templateHandle, name, source => {
            let factory = createTemplate(source);
            return factory.create();
        });
        return {
            handle: definitionHandle,
            capabilities: this.getCapabilities(definitionHandle),
            compilable: template.asWrappedLayout(),
        };
        // let handle = this.resolver.lookupComponentHandle(name, referrer);
        // if (handle === null) {
        //   return null;
        // }
        // return {
        //   handle,
        //   capabilities: this.getCapabilities(handle),
        //   compilable: this.getLayout(handle),
        // };
    }
    resolve(handle) {
        let registry = this.handleLookup[handle];
        return registry.getByHandle(handle);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVnaXN0cnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9saWIvbW9kZXMvaml0L3JlZ2lzdHJ5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQWNBLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDckMsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQWUvQyxNQUFNLE9BQU8sYUFBYTtJQUExQjtRQUNVLFdBQU0sR0FBOEIsSUFBSSxFQUFVLENBQUM7UUFDbkQsYUFBUSxHQUF5QixJQUFJLEVBQUssQ0FBQztJQXNCckQsQ0FBQztJQXBCQyxPQUFPLENBQUMsSUFBWTtRQUNsQixPQUFPLElBQUksSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDO0lBQzdCLENBQUM7SUFFRCxTQUFTLENBQUMsSUFBWTtRQUNwQixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDM0IsQ0FBQztJQUVELFNBQVMsQ0FBQyxJQUFZO1FBQ3BCLE9BQU8sSUFBSSxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUM7SUFDL0IsQ0FBQztJQUVELFdBQVcsQ0FBQyxNQUFjO1FBQ3hCLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUMvQixDQUFDO0lBRUQsUUFBUSxDQUFDLE1BQWMsRUFBRSxJQUFZLEVBQUUsS0FBUTtRQUM3QyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEtBQUssQ0FBQztRQUM5QixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLE1BQU0sQ0FBQztJQUM3QixDQUFDO0NBQ0Y7QUFFRCxNQUFNLENBQUMsT0FBTyxPQUFPLFFBQVE7SUFBN0I7UUFDRSxXQUFNLEdBQUcsSUFBSSxhQUFhLEVBQWlCLENBQUM7UUFDNUMsYUFBUSxHQUFzQyxJQUFJLGFBQWEsRUFBc0IsQ0FBQztRQUN0RixZQUFPLEdBQUcsSUFBSSxhQUFh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QU8sT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQzFCLENBQUMsQ0FBQyxDQUFDO1FBRUgsT0FBTztZQUNMLE1BQU0sRUFBRSxnQkFBZ0I7WUFDeEIsWUFBWSxFQUFFLElBQUksQ0FBQyxlQUFlLENBQUMsZ0JBQWdCLENBQUM7WUFDcEQsVUFBVSxFQUFFLFFBQVEsQ0FBQyxlQUFlLEVBQUU7U0FDdkMsQ0FBQztRQUVGLG9FQUFvRTtRQUVwRSx5QkFBeUI7UUFDekIsaUJBQWlCO1FBQ2pCLElBQUk7UUFFSixXQUFXO1FBQ1gsWUFBWTtRQUNaLGdEQUFnRDtRQUNoRCx3Q0FBd0M7UUFDeEMsS0FBSztJQUNQLENBQUM7SUFFRCxPQUFPLENBQUksTUFBYztRQUN2QixJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3pDLE9BQU8sUUFBUSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQU0sQ0FBQztJQUMzQyxDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBBbm5vdGF0ZWRNb2R1bGVMb2NhdG9yLFxuICBDb21waWxhYmxlUHJvZ3JhbSxcbiAgQ29tcGlsZVRpbWVDb21wb25lbnQsXG4gIENvbXBvbmVudENhcGFiaWxpdGllcyxcbiAgQ29tcG9uZW50RGVmaW5pdGlvbixcbiAgSGVscGVyIGFzIEdsaW1tZXJIZWxwZXIsXG4gIEludm9jYXRpb24sXG4gIE1vZGlmaWVyRGVmaW5pdGlvbixcbiAgT3B0aW9uLFxuICBQYXJ0aWFsRGVmaW5pdGlvbixcbiAgVGVtcGxhdGUsXG4gIFRlbXBsYXRlTWV0YSxcbn0gZnJvbSAnQGdsaW1tZXIvaW50ZXJmYWNlcyc7XG5pbXBvcnQgeyBkaWN0IH0gZnJvbSAnQGdsaW1tZXIvdXRpbCc7XG5pbXBvcnQgeyBjcmVhdGVUZW1wbGF0ZSB9IGZyb20gJy4uLy4uL2NvbXBpbGUnO1xuXG5leHBvcnQgaW50ZXJmYWNlIExvb2t1cCB7XG4gIGhlbHBlcjogR2xpbW1lckhlbHBlcjtcbiAgbW9kaWZpZXI6IE1vZGlmaWVyRGVmaW5pdGlvbjtcbiAgcGFydGlhbDogUGFydGlhbERlZmluaXRpb247XG4gIGNvbXBvbmVudDogQ29tcG9uZW50RGVmaW5pdGlvbjtcbiAgdGVtcGxhdGU6IEludm9jYXRpb247XG4gIGNvbXBpbGFibGU6IFRlbXBsYXRlO1xuICAndGVtcGxhdGUtc291cmNlJzogc3RyaW5nO1xufVxuXG5leHBvcnQgdHlwZSBMb29rdXBUeXBlID0ga2V5b2YgTG9va3VwO1xuZXhwb3J0IHR5cGUgTG9va3VwVmFsdWUgPSBMb29rdXBbTG9va3VwVHlwZV07XG5cbmV4cG9ydCBjbGFzcyBUeXBlZFJlZ2lzdHJ5PFQ+IHtcbiAgcHJpdmF0ZSBieU5hbWU6IHsgW2tleTogc3RyaW5nXTogbnVtYmVyIH0gPSBkaWN0PG51bWJlcj4oKTtcbiAgcHJpdmF0ZSBieUhhbmRsZTogeyBba2V5OiBudW1iZXJdOiBUIH0gPSBkaWN0PFQ+KCk7XG5cbiAgaGFzTmFtZShuYW1lOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICByZXR1cm4gbmFtZSBpbiB0aGlzLmJ5TmFtZTtcbiAgfVxuXG4gIGdldEhhbmRsZShuYW1lOiBzdHJpbmcpOiBPcHRpb248bnVtYmVyPiB7XG4gICAgcmV0dXJuIHRoaXMuYnlOYW1lW25hbWVdO1xuICB9XG5cbiAgaGFzSGFuZGxlKG5hbWU6IG51bWJlcik6IGJvb2xlYW4ge1xuICAgIHJldHVybiBuYW1lIGluIHRoaXMuYnlIYW5kbGU7XG4gIH1cblxuICBnZXRCeUhhbmRsZShoYW5kbGU6IG51bWJlcik6IE9wdGlvbjxUPiB7XG4gICAgcmV0dXJuIHRoaXMuYnlIYW5kbGVbaGFuZGxlXTtcbiAgfVxuXG4gIHJlZ2lzdGVyKGhhbmRsZTogbnVtYmVyLCBuYW1lOiBzdHJpbmcsIHZhbHVlOiBUKTogdm9pZCB7XG4gICAgdGhpcy5ieUhhbmRsZVtoYW5kbGVdID0gdmFsdWU7XG4gICAgdGhpcy5ieU5hbWVbbmFtZV0gPSBoYW5kbGU7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVnaXN0cnkge1xuICBoZWxwZXIgPSBuZXcgVHlwZWRSZWdpc3RyeTxHbGltbWVySGVscGVyPigpO1xuICBtb2RpZmllcjogVHlwZWRSZWdpc3RyeTxNb2RpZmllckRlZmluaXRpb24+ID0gbmV3IFR5cGVkUmVnaXN0cnk8TW9kaWZpZXJEZWZpbml0aW9uPigpO1xuICBwYXJ0aWFsID0gbmV3IFR5cGVkUmVnaXN0cnk8UGFydGlhbERlZmluaXRpb24+KCk7XG4gIGNvbXBvbmVudDogVHlwZWRSZWdpc3RyeTxDb21wb25lbnREZWZpbml0aW9uPiA9IG5ldyBUeXBlZFJlZ2lzdHJ5PENvbXBvbmVudERlZmluaXRpb24+KCk7XG4gIHRlbXBsYXRlID0gbmV3IFR5cGVkUmVnaXN0cnk8SW52b2NhdGlvbj4oKTtcbiAgY29tcGlsYWJsZSA9IG5ldyBUeXBlZFJlZ2lzdHJ5PENvbXBpbGFibGVQcm9ncmFtPigpO1xuICAndGVtcGxhdGUtc291cmNlJyA9IG5ldyBUeXBlZFJlZ2lzdHJ5PHN0cmluZz4oKTtcbn1cblxuZXhwb3J0IGNsYXNzIFRlc3RKaXRSZWdpc3RyeSB7XG4gIHByaXZhdGUgaGFuZGxlTG9va3VwOiBUeXBlZFJlZ2lzdHJ5PHVua25vd24+W10gPSBbXTtcbiAgcHJpdmF0ZSByZWdpc3RyeSA9IG5ldyBSZWdpc3RyeSgpO1xuXG4gIHJlZ2lzdGVyPEsgZXh0ZW5kcyBMb29rdXBUeXBlPih0eXBlOiBLLCBuYW1lOiBzdHJpbmcsIHZhbHVlOiBMb29rdXBbS10pOiBudW1iZXIge1xuICAgIGxldCByZWdpc3RyeSA9IHRoaXMucmVnaXN0cnlbdHlwZV07XG4gICAgbGV0IGhhbmRsZSA9IHRoaXMuaGFuZGxlTG9va3VwLmxlbmd0aDtcbiAgICB0aGlzLmhhbmRsZUxvb2t1cC5wdXNoKHJlZ2lzdHJ5KTtcbiAgICAodGhpcy5yZWdpc3RyeVt0eXBlXSBhcyBUeXBlZFJlZ2lzdHJ5PGFueT4pLnJlZ2lzdGVyKGhhbmRsZSwgbmFtZSwgdmFsdWUpO1xuICAgIHJldHVybiBoYW5kbGU7XG4gIH1cblxuICBjdXN0b21Db21waWxhYmxlVGVtcGxhdGUoXG4gICAgc291cmNlSGFuZGxlOiBudW1iZXIsXG4gICAgdGVtcGxhdGVOYW1lOiBzdHJpbmcsXG4gICAgY3JlYXRlOiAoc291cmNlOiBzdHJpbmcpID0+IFRlbXBsYXRlXG4gICk6IFRlbXBsYXRlIHtcbiAgICBsZXQgY29tcGlsYWJsZUhhbmRsZSA9IHRoaXMubG9va3VwKCdjb21waWxhYmxlJywgdGVtcGxhdGVOYW1lKTtcblxuICAgIGlmIChjb21waWxhYmxlSGFuZGxlKSB7XG4gICAgICByZXR1cm4gdGhpcy5yZXNvbHZlPFRlbXBsYXRlPihjb21waWxhYmxlSGFuZGxlKTtcbiAgICB9XG5cbiAgICBsZXQgc291cmNlID0gdGhpcy5yZXNvbHZlPHN0cmluZz4oc291cmNlSGFuZGxlKTtcblxuICAgIGxldCBjb21waWxhYmxlID0gY3JlYXRlKHNvdXJjZSk7XG4gICAgdGhpcy5yZWdpc3RlcignY29tcGlsYWJsZScsIHRlbXBsYXRlTmFtZSwgY29tcGlsYWJsZSk7XG4gICAgcmV0dXJuIGNvbXBpbGFibGU7XG4gIH1cblxuICB0ZW1wbGF0ZUZyb21Tb3VyY2UoXG4gICAgc291cmNlOiBzdHJpbmcsXG4gICAgdGVtcGxhdGVOYW1lOiBzdHJpbmcsXG4gICAgY3JlYXRlOiAoc291cmNlOiBzdHJpbmcpID0+IFRlbXBsYXRlXG4gICk6IFRlbXBsYXRlIHtcbiAgICBsZXQgY29tcGlsYWJsZUhhbmRsZSA9IHRoaXMubG9va3VwKCdjb21waWxhYmxlJywgdGVtcGxhdGVOYW1lKTtcblxuICAgIGlmIChjb21waWxhYmxlSGFuZGxlKSB7XG4gICAgICByZXR1cm4gdGhpcy5yZXNvbHZlPFRlbXBsYXRlPihjb21waWxhYmxlSGFuZGxlKTtcbiAgICB9XG5cbiAgICBsZXQgdGVtcGxhdGUgPSBjcmVhdGUoc291cmNlKTtcbiAgICB0aGlzLnJlZ2lzdGVyKCdjb21waWxhYmxlJywgdGVtcGxhdGVOYW1lLCB0ZW1wbGF0ZSk7XG4gICAgcmV0dXJuIHRlbXBsYXRlO1xuICB9XG5cbiAgY29tcGlsZVRlbXBsYXRlKFxuICAgIHNvdXJjZUhhbmRsZTogbnVtYmVyLFxuICAgIHRlbXBsYXRlTmFtZTogc3RyaW5nLFxuICAgIGNyZWF0ZTogKHNvdXJjZTogc3RyaW5nKSA9PiBJbnZvY2F0aW9uXG4gICk6IEludm9jYXRpb24ge1xuICAgIGxldCBpbnZvY2F0aW9uSGFuZGxlID0gdGhpcy5sb29rdXAoJ3RlbXBsYXRlJywgdGVtcGxhdGVOYW1lKTtcblxuICAgIGlmIChpbnZvY2F0aW9uSGFuZGxlKSB7XG4gICAgICByZXR1cm4gdGhpcy5yZXNvbHZlPEludm9jYXRpb24+KGludm9jYXRpb25IYW5kbGUpO1xuICAgIH1cblxuICAgIGxldCBzb3VyY2UgPSB0aGlzLnJlc29sdmU8c3RyaW5nPihzb3VyY2VIYW5kbGUpO1xuXG4gICAgbGV0IGludm9jYXRpb24gPSBjcmVhdGUoc291cmNlKTtcbiAgICB0aGlzLnJlZ2lzdGVyKCd0ZW1wbGF0ZScsIHRlbXBsYXRlTmFtZSwgaW52b2NhdGlvbik7XG4gICAgcmV0dXJuIGludm9jYXRpb247XG4gIH1cblxuICBsb29rdXAoXG4gICAgdHlwZTogTG9va3VwVHlwZSxcbiAgICBuYW1lOiBzdHJpbmcsXG4gICAgX3JlZmVycmVyPzogT3B0aW9uPFRlbXBsYXRlTWV0YTxBbm5vdGF0ZWRNb2R1bGVMb2NhdG9yPj5cbiAgKTogT3B0aW9uPG51bWJlcj4ge1xuICAgIGlmICh0aGlzLnJlZ2lzdHJ5W3R5cGVdLmhhc05hbWUobmFtZSkpIHtcbiAgICAgIHJldHVybiB0aGlzLnJlZ2lzdHJ5W3R5cGVdLmdldEhhbmRsZShuYW1lKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9XG5cbiAgbG9va3VwQ29tcG9uZW50SGFuZGxlKFxuICAgIG5hbWU6IHN0cmluZyxcbiAgICByZWZlcnJlcj86IE9wdGlvbjxUZW1wbGF0ZU1ldGE8QW5ub3RhdGVkTW9kdWxlTG9jYXRvcj4+XG4gICk6IE9wdGlvbjxudW1iZXI+IHtcbiAgICByZXR1cm4gdGhpcy5sb29rdXAoJ2NvbXBvbmVudCcsIG5hbWUsIHJlZmVycmVyKTtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0Q2FwYWJpbGl0aWVzKGhhbmRsZTogbnVtYmVyKTogQ29tcG9uZW50Q2FwYWJpbGl0aWVzIHtcbiAgICBsZXQgZGVmaW5pdGlvbiA9IHRoaXMucmVzb2x2ZTxPcHRpb248Q29tcG9uZW50RGVmaW5pdGlvbj4+KGhhbmRsZSk7XG4gICAgbGV0IHsgbWFuYWdlciwgc3RhdGUgfSA9IGRlZmluaXRpb24hO1xuICAgIHJldHVybiBtYW5hZ2VyLmdldENhcGFiaWxpdGllcyhzdGF0ZSk7XG4gIH1cblxuICBsb29rdXBDb21waWxlVGltZUNvbXBvbmVudChcbiAgICBuYW1lOiBzdHJpbmcsXG4gICAgcmVmZXJyZXI6IE9wdGlvbjxUZW1wbGF0ZU1ldGE8QW5ub3RhdGVkTW9kdWxlTG9jYXRvcj4+XG4gICk6IE9wdGlvbjxDb21waWxlVGltZUNvbXBvbmVudD4ge1xuICAgIGxldCBkZWZpbml0aW9uSGFuZGxlID0gdGhpcy5sb29rdXBDb21wb25lbnRIYW5kbGUobmFtZSwgcmVmZXJyZXIpO1xuXG4gICAgaWYgKGRlZmluaXRpb25IYW5kbGUgPT09IG51bGwpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGxldCB0ZW1wbGF0ZUhhbmRsZSA9IHRoaXMubG9va3VwKCd0ZW1wbGF0ZS1zb3VyY2UnLCBuYW1lLCBudWxsKTtcblxuICAgIGlmICh0ZW1wbGF0ZUhhbmRsZSA9PT0gbnVsbCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdCVUc6IG1pc3NpbmcgZHluYW1pYyBsYXlvdXQnKTtcbiAgICB9XG5cbiAgICAvLyBUT0RPOiBUaGlzIHdob2xlIHRoaW5nIHByb2JhYmx5IHNob3VsZCBoYXZlIGEgbW9yZSBmaXJzdC1jbGFzc1xuICAgIC8vIHN0cnVjdHVyZS5cbiAgICBsZXQgdGVtcGxhdGUgPSB0aGlzLmN1c3RvbUNvbXBpbGFibGVUZW1wbGF0ZSh0ZW1wbGF0ZUhhbmRsZSwgbmFtZSwgc291cmNlID0+IHtcbiAgICAgIGxldCBmYWN0b3J5ID0gY3JlYXRlVGVtcGxhdGU8QW5ub3RhdGVkTW9kdWxlTG9jYXRvcj4oc291cmNlKTtcbiAgICAgIHJldHVybiBmYWN0b3J5LmNyZWF0ZSgpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGhhbmRsZTogZGVmaW5pdGlvbkhhbmRsZSxcbiAgICAgIGNhcGFiaWxpdGllczogdGhpcy5nZXRDYXBhYmlsaXRpZXMoZGVmaW5pdGlvbkhhbmRsZSksXG4gICAgICBjb21waWxhYmxlOiB0ZW1wbGF0ZS5hc1dyYXBwZWRMYXlvdXQoKSxcbiAgICB9O1xuXG4gICAgLy8gbGV0IGhhbmRsZSA9IHRoaXMucmVzb2x2ZXIubG9va3VwQ29tcG9uZW50SGFuZGxlKG5hbWUsIHJlZmVycmVyKTtcblxuICAgIC8vIGlmIChoYW5kbGUgPT09IG51bGwpIHtcbiAgICAvLyAgIHJldHVybiBudWxsO1xuICAgIC8vIH1cblxuICAgIC8vIHJldHVybiB7XG4gICAgLy8gICBoYW5kbGUsXG4gICAgLy8gICBjYXBhYmlsaXRpZXM6IHRoaXMuZ2V0Q2FwYWJpbGl0aWVzKGhhbmRsZSksXG4gICAgLy8gICBjb21waWxhYmxlOiB0aGlzLmdldExheW91dChoYW5kbGUpLFxuICAgIC8vIH07XG4gIH1cblxuICByZXNvbHZlPFQ+KGhhbmRsZTogbnVtYmVyKTogVCB7XG4gICAgbGV0IHJlZ2lzdHJ5ID0gdGhpcy5oYW5kbGVMb29rdXBbaGFuZGxlXTtcbiAgICByZXR1cm4gcmVnaXN0cnkuZ2V0QnlIYW5kbGUoaGFuZGxlKSBhcyBUO1xuICB9XG59XG4iXX0=