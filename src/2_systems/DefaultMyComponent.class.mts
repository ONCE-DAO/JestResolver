import { ClassDescriptor } from "ior:esm:/tla.EAM.Once[dev]";
import { BaseUcpComponent, DefaultUcpModel, UcpModel, UcpModelProxySchema, z } from "ior:esm:/tla.EAM.UcpComponent[main]";
import MyComponent from "../3_services/MyComponent.interface.mjs";

const modelSchema =
    z.object({
        someExampleNumber: z.number(),
        someExampleString: z.string().regex(/^foo?$/)
    }).merge(BaseUcpComponent.modelSchema).merge(UcpModelProxySchema);

type ModelDataType = z.infer<typeof modelSchema>

@ClassDescriptor.componentExport("defaultExport")
export default class DefaultMyComponent extends BaseUcpComponent<ModelDataType, MyComponent> implements MyComponent {

    static get modelSchema() {
        return modelSchema;
    }

    public readonly ucpModel: UcpModel = new DefaultUcpModel<ModelDataType, MyComponent>(DefaultMyComponent.modelDefaultData, this);

    static get modelDefaultData() {
        return {
            ...super.modelDefaultData,
            someExampleNumber: 3000,
            someExampleString: "foo"
        }
    }
}
