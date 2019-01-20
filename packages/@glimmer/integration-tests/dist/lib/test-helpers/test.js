import { keys } from '@glimmer/util';
export function test(...args) {
    if (args.length === 1) {
        let meta = args[0];
        return (_target, _name, descriptor) => {
            let testFunction = descriptor.value;
            keys(meta).forEach(key => (testFunction[key] = meta[key]));
            setTestingDescriptor(descriptor);
        };
    }
    let descriptor = args[2];
    setTestingDescriptor(descriptor);
    return descriptor;
}
function setTestingDescriptor(descriptor) {
    let testFunction = descriptor.value;
    descriptor.enumerable = true;
    testFunction['isTest'] = true;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi90ZXN0LWhlbHBlcnMvdGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQSxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBUXJDLE1BQU0sVUFBVSxJQUFJLENBQUMsR0FBRyxJQUFXO0lBQ2pDLElBQUksSUFBSSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7UUFDckIsSUFBSSxJQUFJLEdBQXNCLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0QyxPQUFPLENBQUMsT0FBZSxFQUFFLEtBQWEsRUFBRSxVQUE4QixFQUFFLEVBQUU7WUFDeEUsSUFBSSxZQUFZLEdBQUcsVUFBVSxDQUFDLEtBQXdCLENBQUM7WUFDdkQsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDM0Qsb0JBQW9CLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDbkMsQ0FBQyxDQUFDO0tBQ0g7SUFFRCxJQUFJLFVBQVUsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDekIsb0JBQW9CLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDakMsT0FBTyxVQUFVLENBQUM7QUFDcEIsQ0FBQztBQUVELFNBQVMsb0JBQW9CLENBQUMsVUFBOEI7SUFDMUQsSUFBSSxZQUFZLEdBQUcsVUFBVSxDQUFDLEtBQXdCLENBQUM7SUFDdkQsVUFBVSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7SUFDN0IsWUFBWSxDQUFDLFFBQVEsQ0FBQyxHQUFHLElBQUksQ0FBQztBQUNoQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50VGVzdE1ldGEgfSBmcm9tICcuLi90ZXN0LWRlY29yYXRvcic7XG5pbXBvcnQgeyBEaWN0IH0gZnJvbSAnQGdsaW1tZXIvaW50ZXJmYWNlcyc7XG5pbXBvcnQgeyBrZXlzIH0gZnJvbSAnQGdsaW1tZXIvdXRpbCc7XG5cbmV4cG9ydCBmdW5jdGlvbiB0ZXN0KG1ldGE6IENvbXBvbmVudFRlc3RNZXRhKTogTWV0aG9kRGVjb3JhdG9yO1xuZXhwb3J0IGZ1bmN0aW9uIHRlc3QoXG4gIF90YXJnZXQ6IE9iamVjdCB8IENvbXBvbmVudFRlc3RNZXRhLFxuICBfbmFtZT86IHN0cmluZyxcbiAgZGVzY3JpcHRvcj86IFByb3BlcnR5RGVzY3JpcHRvclxuKTogUHJvcGVydHlEZXNjcmlwdG9yIHwgdm9pZDtcbmV4cG9ydCBmdW5jdGlvbiB0ZXN0KC4uLmFyZ3M6IGFueVtdKSB7XG4gIGlmIChhcmdzLmxlbmd0aCA9PT0gMSkge1xuICAgIGxldCBtZXRhOiBDb21wb25lbnRUZXN0TWV0YSA9IGFyZ3NbMF07XG4gICAgcmV0dXJuIChfdGFyZ2V0OiBPYmplY3QsIF9uYW1lOiBzdHJpbmcsIGRlc2NyaXB0b3I6IFByb3BlcnR5RGVzY3JpcHRvcikgPT4ge1xuICAgICAgbGV0IHRlc3RGdW5jdGlvbiA9IGRlc2NyaXB0b3IudmFsdWUgYXMgRnVuY3Rpb24gJiBEaWN0O1xuICAgICAga2V5cyhtZXRhKS5mb3JFYWNoKGtleSA9PiAodGVzdEZ1bmN0aW9uW2tleV0gPSBtZXRhW2tleV0pKTtcbiAgICAgIHNldFRlc3RpbmdEZXNjcmlwdG9yKGRlc2NyaXB0b3IpO1xuICAgIH07XG4gIH1cblxuICBsZXQgZGVzY3JpcHRvciA9IGFyZ3NbMl07XG4gIHNldFRlc3RpbmdEZXNjcmlwdG9yKGRlc2NyaXB0b3IpO1xuICByZXR1cm4gZGVzY3JpcHRvcjtcbn1cblxuZnVuY3Rpb24gc2V0VGVzdGluZ0Rlc2NyaXB0b3IoZGVzY3JpcHRvcjogUHJvcGVydHlEZXNjcmlwdG9yKTogdm9pZCB7XG4gIGxldCB0ZXN0RnVuY3Rpb24gPSBkZXNjcmlwdG9yLnZhbHVlIGFzIEZ1bmN0aW9uICYgRGljdDtcbiAgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gdHJ1ZTtcbiAgdGVzdEZ1bmN0aW9uWydpc1Rlc3QnXSA9IHRydWU7XG59XG4iXX0=