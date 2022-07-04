import { InterfaceDescriptor } from "ior:esm:/tla.EAM.Once[dev]";

export default interface MyComponent {

}

export const MyComponentID = InterfaceDescriptor.lastDescriptor;
MyComponentID.componentExport = "namedExport";
