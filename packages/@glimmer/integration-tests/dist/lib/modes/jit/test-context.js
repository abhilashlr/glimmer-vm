import TestJitRuntimeResolver from './resolver';
import { JitRuntime } from '@glimmer/runtime';
import { registerHelper } from './register';
import { TestJitCompilationContext } from './compilation-context';
import { TestMacros } from '../../compile/macros';
import { assign } from '@glimmer/util';
export function JitTestContext(delegate = {}) {
    let resolver = new TestJitRuntimeResolver();
    let registry = resolver.registry;
    registerHelper(registry, 'hash', (_positional, named) => named);
    let context = new TestJitCompilationContext(resolver, registry);
    let syntax = { program: context, macros: new TestMacros() };
    let doc = document;
    let runtime = JitRuntime(document, context.program(), resolver, assign({
        toBool: emberToBool,
    }, delegate));
    let root = document.getElementById('qunit-fixture');
    return { resolver, registry, program: context, syntax, doc, root, runtime, env: runtime.env };
}
export function emberToBool(value) {
    if (Array.isArray(value)) {
        return value.length > 0;
    }
    else {
        return !!value;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC1jb250ZXh0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vbGliL21vZGVzL2ppdC90ZXN0LWNvbnRleHQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxzQkFBc0IsTUFBTSxZQUFZLENBQUM7QUFVaEQsT0FBTyxFQUE4QixVQUFVLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUMxRSxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sWUFBWSxDQUFDO0FBQzVDLE9BQU8sRUFBRSx5QkFBeUIsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBQ2xFLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUNsRCxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBYXZDLE1BQU0sVUFBVSxjQUFjLENBQUMsV0FBdUMsRUFBRTtJQUN0RSxJQUFJLFFBQVEsR0FBRyxJQUFJLHNCQUFzQixFQUFFLENBQUM7SUFDNUMsSUFBSSxRQUFRLEdBQUcsUUFBUSxDQUFDLFFBQVEsQ0FBQztJQUNqQyxjQUFjLENBQUMsUUFBUSxFQUFFLE1BQU0sRUFBRSxDQUFDLFdBQVcsRUFBRSxLQUFLLEVBQUUsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBRWhFLElBQUksT0FBTyxHQUFHLElBQUkseUJBQXlCLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQ2hFLElBQUksTUFBTSxHQUE2QixFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLElBQUksVUFBVSxFQUFFLEVBQUUsQ0FBQztJQUN0RixJQUFJLEdBQUcsR0FBRyxRQUEwQixDQUFDO0lBRXJDLElBQUksT0FBTyxHQUFHLFVBQVUsQ0FDdEIsUUFBMEIsRUFDMUIsT0FBTyxDQUFDLE9BQU8sRUFBRSxFQUNqQixRQUFRLEVBQ1IsTUFBTSxDQUNKO1FBQ0UsTUFBTSxFQUFFLFdBQVc7S0FDcEIsRUFDRCxRQUFRLENBQ1QsQ0FDRixDQUFDO0lBRUYsSUFBSSxJQUFJLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxlQUFlLENBQW1CLENBQUM7SUFFdEUsT0FBTyxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsR0FBRyxFQUFFLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUNoRyxDQUFDO0FBRUQsTUFBTSxVQUFVLFdBQVcsQ0FBQyxLQUFVO0lBQ3BDLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRTtRQUN4QixPQUFPLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0tBQ3pCO1NBQU07UUFDTCxPQUFPLENBQUMsQ0FBQyxLQUFLLENBQUM7S0FDaEI7QUFDSCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFRlc3RKaXRSdW50aW1lUmVzb2x2ZXIgZnJvbSAnLi9yZXNvbHZlcic7XG5pbXBvcnQgeyBUZXN0Sml0UmVnaXN0cnkgfSBmcm9tICcuL3JlZ2lzdHJ5JztcbmltcG9ydCB7XG4gIFN5bnRheENvbXBpbGF0aW9uQ29udGV4dCxcbiAgV2hvbGVQcm9ncmFtQ29tcGlsYXRpb25Db250ZXh0LFxuICBKaXRSdW50aW1lQ29udGV4dCxcbiAgRW52aXJvbm1lbnQsXG4gIFRlbXBsYXRlTWV0YSxcbn0gZnJvbSAnQGdsaW1tZXIvaW50ZXJmYWNlcyc7XG5pbXBvcnQgeyBTaW1wbGVEb2N1bWVudCwgU2ltcGxlRWxlbWVudCB9IGZyb20gJ0BzaW1wbGUtZG9tL2ludGVyZmFjZSc7XG5pbXBvcnQgeyBSdW50aW1lRW52aXJvbm1lbnREZWxlZ2F0ZSwgSml0UnVudGltZSB9IGZyb20gJ0BnbGltbWVyL3J1bnRpbWUnO1xuaW1wb3J0IHsgcmVnaXN0ZXJIZWxwZXIgfSBmcm9tICcuL3JlZ2lzdGVyJztcbmltcG9ydCB7IFRlc3RKaXRDb21waWxhdGlvbkNvbnRleHQgfSBmcm9tICcuL2NvbXBpbGF0aW9uLWNvbnRleHQnO1xuaW1wb3J0IHsgVGVzdE1hY3JvcyB9IGZyb20gJy4uLy4uL2NvbXBpbGUvbWFjcm9zJztcbmltcG9ydCB7IGFzc2lnbiB9IGZyb20gJ0BnbGltbWVyL3V0aWwnO1xuXG5leHBvcnQgaW50ZXJmYWNlIFRlc3RDb250ZXh0IHtcbiAgcmVzb2x2ZXI6IFRlc3RKaXRSdW50aW1lUmVzb2x2ZXI7XG4gIHJlZ2lzdHJ5OiBUZXN0Sml0UmVnaXN0cnk7XG4gIHN5bnRheDogU3ludGF4Q29tcGlsYXRpb25Db250ZXh0O1xuICBwcm9ncmFtOiBXaG9sZVByb2dyYW1Db21waWxhdGlvbkNvbnRleHQ7XG4gIGRvYzogU2ltcGxlRG9jdW1lbnQ7XG4gIHJvb3Q6IFNpbXBsZUVsZW1lbnQ7XG4gIHJ1bnRpbWU6IEppdFJ1bnRpbWVDb250ZXh0PFRlbXBsYXRlTWV0YT47XG4gIGVudjogRW52aXJvbm1lbnQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBKaXRUZXN0Q29udGV4dChkZWxlZ2F0ZTogUnVudGltZUVudmlyb25tZW50RGVsZWdhdGUgPSB7fSk6IFRlc3RDb250ZXh0IHtcbiAgbGV0IHJlc29sdmVyID0gbmV3IFRlc3RKaXRSdW50aW1lUmVzb2x2ZXIoKTtcbiAgbGV0IHJlZ2lzdHJ5ID0gcmVzb2x2ZXIucmVnaXN0cnk7XG4gIHJlZ2lzdGVySGVscGVyKHJlZ2lzdHJ5LCAnaGFzaCcsIChfcG9zaXRpb25hbCwgbmFtZWQpID0+IG5hbWVkKTtcblxuICBsZXQgY29udGV4dCA9IG5ldyBUZXN0Sml0Q29tcGlsYXRpb25Db250ZXh0KHJlc29sdmVyLCByZWdpc3RyeSk7XG4gIGxldCBzeW50YXg6IFN5bnRheENvbXBpbGF0aW9uQ29udGV4dCA9IHsgcHJvZ3JhbTogY29udGV4dCwgbWFjcm9zOiBuZXcgVGVzdE1hY3JvcygpIH07XG4gIGxldCBkb2MgPSBkb2N1bWVudCBhcyBTaW1wbGVEb2N1bWVudDtcblxuICBsZXQgcnVudGltZSA9IEppdFJ1bnRpbWUoXG4gICAgZG9jdW1lbnQgYXMgU2ltcGxlRG9jdW1lbnQsXG4gICAgY29udGV4dC5wcm9ncmFtKCksXG4gICAgcmVzb2x2ZXIsXG4gICAgYXNzaWduKFxuICAgICAge1xuICAgICAgICB0b0Jvb2w6IGVtYmVyVG9Cb29sLFxuICAgICAgfSxcbiAgICAgIGRlbGVnYXRlXG4gICAgKVxuICApO1xuXG4gIGxldCByb290ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3F1bml0LWZpeHR1cmUnKSEgYXMgU2ltcGxlRWxlbWVudDtcblxuICByZXR1cm4geyByZXNvbHZlciwgcmVnaXN0cnksIHByb2dyYW06IGNvbnRleHQsIHN5bnRheCwgZG9jLCByb290LCBydW50aW1lLCBlbnY6IHJ1bnRpbWUuZW52IH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBlbWJlclRvQm9vbCh2YWx1ZTogYW55KTogYm9vbGVhbiB7XG4gIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgIHJldHVybiB2YWx1ZS5sZW5ndGggPiAwO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiAhIXZhbHVlO1xuICB9XG59XG4iXX0=