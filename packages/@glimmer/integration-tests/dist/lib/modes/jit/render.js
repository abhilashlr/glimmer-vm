import { preprocess } from '../../compile';
import { renderJitMain, renderSync } from '@glimmer/runtime';
export function renderTemplate(src, { runtime, syntax }, self, builder) {
    let template = preprocess(src);
    let iterator = renderJitMain(runtime, syntax, self, builder, template.asLayout().compile(syntax));
    return renderSync(runtime.env, iterator);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVuZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vbGliL21vZGVzL2ppdC9yZW5kZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBR0EsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQUUsYUFBYSxFQUFFLFVBQVUsRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBRTdELE1BQU0sVUFBVSxjQUFjLENBQzVCLEdBQVcsRUFDWCxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQTBCLEVBQzNDLElBQTRCLEVBQzVCLE9BQXVCO0lBRXZCLElBQUksUUFBUSxHQUFHLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUMvQixJQUFJLFFBQVEsR0FBRyxhQUFhLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLFFBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztJQUNsRyxPQUFPLFVBQVUsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBQzNDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBKaXRUZXN0RGVsZWdhdGVDb250ZXh0IH0gZnJvbSAnLi9kZWxlZ2F0ZSc7XG5pbXBvcnQgeyBWZXJzaW9uZWRQYXRoUmVmZXJlbmNlIH0gZnJvbSAnQGdsaW1tZXIvcmVmZXJlbmNlJztcbmltcG9ydCB7IEVsZW1lbnRCdWlsZGVyLCBSZW5kZXJSZXN1bHQgfSBmcm9tICdAZ2xpbW1lci9pbnRlcmZhY2VzJztcbmltcG9ydCB7IHByZXByb2Nlc3MgfSBmcm9tICcuLi8uLi9jb21waWxlJztcbmltcG9ydCB7IHJlbmRlckppdE1haW4sIHJlbmRlclN5bmMgfSBmcm9tICdAZ2xpbW1lci9ydW50aW1lJztcblxuZXhwb3J0IGZ1bmN0aW9uIHJlbmRlclRlbXBsYXRlKFxuICBzcmM6IHN0cmluZyxcbiAgeyBydW50aW1lLCBzeW50YXggfTogSml0VGVzdERlbGVnYXRlQ29udGV4dCxcbiAgc2VsZjogVmVyc2lvbmVkUGF0aFJlZmVyZW5jZSxcbiAgYnVpbGRlcjogRWxlbWVudEJ1aWxkZXJcbik6IFJlbmRlclJlc3VsdCB7XG4gIGxldCB0ZW1wbGF0ZSA9IHByZXByb2Nlc3Moc3JjKTtcbiAgbGV0IGl0ZXJhdG9yID0gcmVuZGVySml0TWFpbihydW50aW1lLCBzeW50YXgsIHNlbGYsIGJ1aWxkZXIsIHRlbXBsYXRlLmFzTGF5b3V0KCkuY29tcGlsZShzeW50YXgpKTtcbiAgcmV0dXJuIHJlbmRlclN5bmMocnVudGltZS5lbnYsIGl0ZXJhdG9yKTtcbn1cbiJdfQ==