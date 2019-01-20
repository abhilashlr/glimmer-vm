import { getDynamicVar, JitRuntime, clientBuilder } from '@glimmer/runtime';
import { registerInternalHelper, registerStaticTaglessComponent, registerEmberishCurlyComponent, registerEmberishGlimmerComponent, registerModifier, registerHelper, } from './register';
import { TestMacros } from '../../compile/macros';
import { TestJitCompilationContext } from './compilation-context';
import TestJitRuntimeResolver from './resolver';
import { UpdatableReference } from '@glimmer/reference';
import { renderTemplate } from './render';
export function JitDelegateContext(doc, resolver, registry) {
    registerInternalHelper(registry, '-get-dynamic-var', getDynamicVar);
    let context = new TestJitCompilationContext(resolver, registry);
    let runtime = JitRuntime(doc, context.program(), resolver);
    let syntax = { program: context, macros: new TestMacros() };
    return { runtime, syntax };
}
export class JitRenderDelegate {
    constructor(doc = document) {
        this.doc = doc;
        this.resolver = new TestJitRuntimeResolver();
        this.registry = this.resolver.registry;
        this.self = null;
        this.context = this.getContext();
    }
    getContext() {
        return JitDelegateContext(this.doc, this.resolver, this.registry);
    }
    getInitialElement() {
        if (isBrowserTestDocument(this.doc)) {
            return this.doc.getElementById('qunit-fixture');
        }
        else {
            return this.createElement('div');
        }
    }
    createElement(tagName) {
        return this.doc.createElement(tagName);
    }
    registerComponent(type, _testType, name, layout, Class) {
        switch (type) {
            case 'Basic':
            case 'Fragment':
                return registerStaticTaglessComponent(this.registry, name, Class, layout);
            case 'Curly':
            case 'Dynamic':
                return registerEmberishCurlyComponent(this.registry, name, Class, layout);
            case 'Glimmer':
                return registerEmberishGlimmerComponent(this.registry, name, Class, layout);
        }
    }
    registerModifier(name, ModifierClass) {
        registerModifier(this.registry, name, ModifierClass);
    }
    registerHelper(name, helper) {
        registerHelper(this.registry, name, helper);
    }
    getElementBuilder(env, cursor) {
        return clientBuilder(env, cursor);
    }
    getSelf(context) {
        if (!this.self) {
            this.self = new UpdatableReference(context);
        }
        return this.self;
    }
    renderTemplate(template, context, element) {
        let cursor = { element, nextSibling: null };
        return renderTemplate(template, this.context, this.getSelf(context), this.getElementBuilder(this.context.runtime.env, cursor));
    }
}
JitRenderDelegate.isEager = false;
JitRenderDelegate.style = 'jit';
function isBrowserTestDocument(doc) {
    return !!(doc.getElementById && doc.getElementById('qunit-fixture'));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVsZWdhdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9saWIvbW9kZXMvaml0L2RlbGVnYXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQWFBLE9BQU8sRUFBRSxhQUFhLEVBQUUsVUFBVSxFQUFFLGFBQWEsRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBQzVFLE9BQU8sRUFDTCxzQkFBc0IsRUFDdEIsOEJBQThCLEVBQzlCLDhCQUE4QixFQUM5QixnQ0FBZ0MsRUFDaEMsZ0JBQWdCLEVBQ2hCLGNBQWMsR0FDZixNQUFNLFlBQVksQ0FBQztBQUNwQixPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDbEQsT0FBTyxFQUFFLHlCQUF5QixFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFDbEUsT0FBTyxzQkFBc0IsTUFBTSxZQUFZLENBQUM7QUFRaEQsT0FBTyxFQUFFLGtCQUFrQixFQUFrQixNQUFNLG9CQUFvQixDQUFDO0FBQ3hFLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFPMUMsTUFBTSxVQUFVLGtCQUFrQixDQUNoQyxHQUFtQixFQUNuQixRQUFnQyxFQUNoQyxRQUF5QjtJQUV6QixzQkFBc0IsQ0FBQyxRQUFRLEVBQUUsa0JBQWtCLEVBQUUsYUFBYSxDQUFDLENBQUM7SUFDcEUsSUFBSSxPQUFPLEdBQUcsSUFBSSx5QkFBeUIsQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDaEUsSUFBSSxPQUFPLEdBQUcsVUFBVSxDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsT0FBTyxFQUFFLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDM0QsSUFBSSxNQUFNLEdBQUcsRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxJQUFJLFVBQVUsRUFBRSxFQUFFLENBQUM7SUFDNUQsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsQ0FBQztBQUM3QixDQUFDO0FBRUQsTUFB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RmUseUJBQU8sR0FBRyxLQUFLLENBQUM7QUFDekIsdUJBQUssR0FBRyxLQUFLLENBQUM7QUE2RnZCLFNBQVMscUJBQXFCLENBQUMsR0FBbUI7SUFDaEQsT0FBTyxDQUFDLENBQUMsQ0FBRSxHQUFXLENBQUMsY0FBYyxJQUFLLEdBQVcsQ0FBQyxjQUFjLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztBQUN6RixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgSml0UnVudGltZUNvbnRleHQsXG4gIFN5bnRheENvbXBpbGF0aW9uQ29udGV4dCxcbiAgRW52aXJvbm1lbnQsXG4gIEN1cnNvcixcbiAgRWxlbWVudEJ1aWxkZXIsXG4gIERpY3QsXG4gIFJlbmRlclJlc3VsdCxcbiAgT3B0aW9uLFxuICBUZW1wbGF0ZU1ldGEsXG59IGZyb20gJ0BnbGltbWVyL2ludGVyZmFjZXMnO1xuaW1wb3J0IHsgU2ltcGxlRG9jdW1lbnQsIFNpbXBsZUVsZW1lbnQgfSBmcm9tICdAc2ltcGxlLWRvbS9pbnRlcmZhY2UnO1xuaW1wb3J0IHsgVGVzdEppdFJlZ2lzdHJ5IH0gZnJvbSAnLi9yZWdpc3RyeSc7XG5pbXBvcnQgeyBnZXREeW5hbWljVmFyLCBKaXRSdW50aW1lLCBjbGllbnRCdWlsZGVyIH0gZnJvbSAnQGdsaW1tZXIvcnVudGltZSc7XG5pbXBvcnQge1xuICByZWdpc3RlckludGVybmFsSGVscGVyLFxuICByZWdpc3RlclN0YXRpY1RhZ2xlc3NDb21wb25lbnQsXG4gIHJlZ2lzdGVyRW1iZXJpc2hDdXJseUNvbXBvbmVudCxcbiAgcmVnaXN0ZXJFbWJlcmlzaEdsaW1tZXJDb21wb25lbnQsXG4gIHJlZ2lzdGVyTW9kaWZpZXIsXG4gIHJlZ2lzdGVySGVscGVyLFxufSBmcm9tICcuL3JlZ2lzdGVyJztcbmltcG9ydCB7IFRlc3RNYWNyb3MgfSBmcm9tICcuLi8uLi9jb21waWxlL21hY3Jvcyc7XG5pbXBvcnQgeyBUZXN0Sml0Q29tcGlsYXRpb25Db250ZXh0IH0gZnJvbSAnLi9jb21waWxhdGlvbi1jb250ZXh0JztcbmltcG9ydCBUZXN0Sml0UnVudGltZVJlc29sdmVyIGZyb20gJy4vcmVzb2x2ZXInO1xuaW1wb3J0IFJlbmRlckRlbGVnYXRlIGZyb20gJy4uLy4uL3JlbmRlci1kZWxlZ2F0ZSc7XG5pbXBvcnQgeyBDb21wb25lbnRLaW5kLCBDb21wb25lbnRUeXBlcyB9IGZyb20gJy4uLy4uL2NvbXBvbmVudHMnO1xuaW1wb3J0IHsgQmFzaWNDb21wb25lbnRGYWN0b3J5IH0gZnJvbSAnLi4vLi4vY29tcG9uZW50cy9iYXNpYyc7XG5pbXBvcnQgeyBFbWJlcmlzaEN1cmx5Q29tcG9uZW50RmFjdG9yeSB9IGZyb20gJy4uLy4uL2NvbXBvbmVudHMvZW1iZXJpc2gtY3VybHknO1xuaW1wb3J0IHsgRW1iZXJpc2hHbGltbWVyQ29tcG9uZW50RmFjdG9yeSB9IGZyb20gJy4uLy4uL2NvbXBvbmVudHMvZW1iZXJpc2gtZ2xpbW1lcic7XG5pbXBvcnQgeyBUZXN0TW9kaWZpZXJDb25zdHJ1Y3RvciB9IGZyb20gJy4uLy4uL21vZGlmaWVycyc7XG5pbXBvcnQgeyBVc2VySGVscGVyIH0gZnJvbSAnLi4vLi4vaGVscGVycyc7XG5pbXBvcnQgeyBVcGRhdGFibGVSZWZlcmVuY2UsIENvbnN0UmVmZXJlbmNlIH0gZnJvbSAnQGdsaW1tZXIvcmVmZXJlbmNlJztcbmltcG9ydCB7IHJlbmRlclRlbXBsYXRlIH0gZnJvbSAnLi9yZW5kZXInO1xuXG5leHBvcnQgaW50ZXJmYWNlIEppdFRlc3REZWxlZ2F0ZUNvbnRleHQge1xuICBydW50aW1lOiBKaXRSdW50aW1lQ29udGV4dDxUZW1wbGF0ZU1ldGE+O1xuICBzeW50YXg6IFN5bnRheENvbXBpbGF0aW9uQ29udGV4dDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIEppdERlbGVnYXRlQ29udGV4dChcbiAgZG9jOiBTaW1wbGVEb2N1bWVudCxcbiAgcmVzb2x2ZXI6IFRlc3RKaXRSdW50aW1lUmVzb2x2ZXIsXG4gIHJlZ2lzdHJ5OiBUZXN0Sml0UmVnaXN0cnlcbikge1xuICByZWdpc3RlckludGVybmFsSGVscGVyKHJlZ2lzdHJ5LCAnLWdldC1keW5hbWljLXZhcicsIGdldER5bmFtaWNWYXIpO1xuICBsZXQgY29udGV4dCA9IG5ldyBUZXN0Sml0Q29tcGlsYXRpb25Db250ZXh0KHJlc29sdmVyLCByZWdpc3RyeSk7XG4gIGxldCBydW50aW1lID0gSml0UnVudGltZShkb2MsIGNvbnRleHQucHJvZ3JhbSgpLCByZXNvbHZlcik7XG4gIGxldCBzeW50YXggPSB7IHByb2dyYW06IGNvbnRleHQsIG1hY3JvczogbmV3IFRlc3RNYWNyb3MoKSB9O1xuICByZXR1cm4geyBydW50aW1lLCBzeW50YXggfTtcbn1cblxuZXhwb3J0IGNsYXNzIEppdFJlbmRlckRlbGVnYXRlIGltcGxlbWVudHMgUmVuZGVyRGVsZWdhdGUge1xuICBzdGF0aWMgcmVhZG9ubHkgaXNFYWdlciA9IGZhbHNlO1xuICBzdGF0aWMgc3R5bGUgPSAnaml0JztcblxuICBwcml2YXRlIHJlc29sdmVyOiBUZXN0Sml0UnVudGltZVJlc29sdmVyID0gbmV3IFRlc3RKaXRSdW50aW1lUmVzb2x2ZXIoKTtcbiAgcHJpdmF0ZSByZWdpc3RyeTogVGVzdEppdFJlZ2lzdHJ5ID0gdGhpcy5yZXNvbHZlci5yZWdpc3RyeTtcbiAgcHJpdmF0ZSBjb250ZXh0OiBKaXRUZXN0RGVsZWdhdGVDb250ZXh0O1xuICBwcml2YXRlIHNlbGY6IE9wdGlvbjxVcGRhdGFibGVSZWZlcmVuY2U+ID0gbnVsbDtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGRvYzogU2ltcGxlRG9jdW1lbnQgPSBkb2N1bWVudCBhcyBTaW1wbGVEb2N1bWVudCkge1xuICAgIHRoaXMuY29udGV4dCA9IHRoaXMuZ2V0Q29udGV4dCgpO1xuICB9XG5cbiAgZ2V0Q29udGV4dCgpOiBKaXRUZXN0RGVsZWdhdGVDb250ZXh0IHtcbiAgICByZXR1cm4gSml0RGVsZWdhdGVDb250ZXh0KHRoaXMuZG9jLCB0aGlzLnJlc29sdmVyLCB0aGlzLnJlZ2lzdHJ5KTtcbiAgfVxuXG4gIGdldEluaXRpYWxFbGVtZW50KCk6IFNpbXBsZUVsZW1lbnQge1xuICAgIGlmIChpc0Jyb3dzZXJUZXN0RG9jdW1lbnQodGhpcy5kb2MpKSB7XG4gICAgICByZXR1cm4gdGhpcy5kb2MuZ2V0RWxlbWVudEJ5SWQoJ3F1bml0LWZpeHR1cmUnKSEgYXMgU2ltcGxlRWxlbWVudDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgfVxuICB9XG5cbiAgY3JlYXRlRWxlbWVudCh0YWdOYW1lOiBzdHJpbmcpOiBTaW1wbGVFbGVtZW50IHtcbiAgICByZXR1cm4gdGhpcy5kb2MuY3JlYXRlRWxlbWVudCh0YWdOYW1lKTtcbiAgfVxuXG4gIHJlZ2lzdGVyQ29tcG9uZW50PEsgZXh0ZW5kcyBDb21wb25lbnRLaW5kLCBMIGV4dGVuZHMgQ29tcG9uZW50S2luZD4oXG4gICAgdHlwZTogSyxcbiAgICBfdGVzdFR5cGU6IEwsXG4gICAgbmFtZTogc3RyaW5nLFxuICAgIGxheW91dDogc3RyaW5nLFxuICAgIENsYXNzPzogQ29tcG9uZW50VHlwZXNbS11cbiAgKSB7XG4gICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICBjYXNlICdCYXNpYyc6XG4gICAgICBjYXNlICdGcmFnbWVudCc6XG4gICAgICAgIHJldHVybiByZWdpc3RlclN0YXRpY1RhZ2xlc3NDb21wb25lbnQoXG4gICAgICAgICAgdGhpcy5yZWdpc3RyeSxcbiAgICAgICAgICBuYW1lLFxuICAgICAgICAgIENsYXNzIGFzIEJhc2ljQ29tcG9uZW50RmFjdG9yeSxcbiAgICAgICAgICBsYXlvdXRcbiAgICAgICAgKTtcbiAgICAgIGNhc2UgJ0N1cmx5JzpcbiAgICAgIGNhc2UgJ0R5bmFtaWMnOlxuICAgICAgICByZXR1cm4gcmVnaXN0ZXJFbWJlcmlzaEN1cmx5Q29tcG9uZW50KFxuICAgICAgICAgIHRoaXMucmVnaXN0cnksXG4gICAgICAgICAgbmFtZSxcbiAgICAgICAgICBDbGFzcyBhcyBFbWJlcmlzaEN1cmx5Q29tcG9uZW50RmFjdG9yeSxcbiAgICAgICAgICBsYXlvdXRcbiAgICAgICAgKTtcbiAgICAgIGNhc2UgJ0dsaW1tZXInOlxuICAgICAgICByZXR1cm4gcmVnaXN0ZXJFbWJlcmlzaEdsaW1tZXJDb21wb25lbnQoXG4gICAgICAgICAgdGhpcy5yZWdpc3RyeSxcbiAgICAgICAgICBuYW1lLFxuICAgICAgICAgIENsYXNzIGFzIEVtYmVyaXNoR2xpbW1lckNvbXBvbmVudEZhY3RvcnksXG4gICAgICAgICAgbGF5b3V0XG4gICAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgcmVnaXN0ZXJNb2RpZmllcihuYW1lOiBzdHJpbmcsIE1vZGlmaWVyQ2xhc3M6IFRlc3RNb2RpZmllckNvbnN0cnVjdG9yKTogdm9pZCB7XG4gICAgcmVnaXN0ZXJNb2RpZmllcih0aGlzLnJlZ2lzdHJ5LCBuYW1lLCBNb2RpZmllckNsYXNzKTtcbiAgfVxuXG4gIHJlZ2lzdGVySGVscGVyKG5hbWU6IHN0cmluZywgaGVscGVyOiBVc2VySGVscGVyKTogdm9pZCB7XG4gICAgcmVnaXN0ZXJIZWxwZXIodGhpcy5yZWdpc3RyeSwgbmFtZSwgaGVscGVyKTtcbiAgfVxuXG4gIGdldEVsZW1lbnRCdWlsZGVyKGVudjogRW52aXJvbm1lbnQsIGN1cnNvcjogQ3Vyc29yKTogRWxlbWVudEJ1aWxkZXIge1xuICAgIHJldHVybiBjbGllbnRCdWlsZGVyKGVudiwgY3Vyc29yKTtcbiAgfVxuXG4gIGdldFNlbGYoY29udGV4dDogdW5rbm93bik6IFVwZGF0YWJsZVJlZmVyZW5jZSB8IENvbnN0UmVmZXJlbmNlIHtcbiAgICBpZiAoIXRoaXMuc2VsZikge1xuICAgICAgdGhpcy5zZWxmID0gbmV3IFVwZGF0YWJsZVJlZmVyZW5jZShjb250ZXh0KTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5zZWxmO1xuICB9XG5cbiAgcmVuZGVyVGVtcGxhdGUodGVtcGxhdGU6IHN0cmluZywgY29udGV4dDogRGljdDx1bmtub3duPiwgZWxlbWVudDogU2ltcGxlRWxlbWVudCk6IFJlbmRlclJlc3VsdCB7XG4gICAgbGV0IGN1cnNvciA9IHsgZWxlbWVudCwgbmV4dFNpYmxpbmc6IG51bGwgfTtcblxuICAgIHJldHVybiByZW5kZXJUZW1wbGF0ZShcbiAgICAgIHRlbXBsYXRlLFxuICAgICAgdGhpcy5jb250ZXh0LFxuICAgICAgdGhpcy5nZXRTZWxmKGNvbnRleHQpLFxuICAgICAgdGhpcy5nZXRFbGVtZW50QnVpbGRlcih0aGlzLmNvbnRleHQucnVudGltZS5lbnYsIGN1cnNvcilcbiAgICApO1xuICB9XG59XG5cbmZ1bmN0aW9uIGlzQnJvd3NlclRlc3REb2N1bWVudChkb2M6IFNpbXBsZURvY3VtZW50KTogZG9jIGlzIFNpbXBsZURvY3VtZW50ICYgRG9jdW1lbnQge1xuICByZXR1cm4gISEoKGRvYyBhcyBhbnkpLmdldEVsZW1lbnRCeUlkICYmIChkb2MgYXMgYW55KS5nZXRFbGVtZW50QnlJZCgncXVuaXQtZml4dHVyZScpKTtcbn1cbiJdfQ==