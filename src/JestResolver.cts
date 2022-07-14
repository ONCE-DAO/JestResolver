import defaultResolver from 'jest-resolve/build/defaultResolver';
import { join, relative, resolve, sep } from 'path';
export type Path = Parameters<typeof defaultResolver>[0];
export type ResolverOptions = Parameters<typeof defaultResolver>[1];
import { JestOnce } from "ior:esm:/tla.EAM.Once[build]"
// import { join, relative } from 'path';
import ComponentBuilder from 'Scenarios/localhost/tla/EAM/Once/build/3_services/Build/BuildComponent.interface.mjs';

class JestResolver {
    cache: Map<string, string> = new Map();
    private componentBuilder: ComponentBuilder[] = [];


    private once: JestOnce
    constructor(private initialized = false) {
        if (ONCE.mode !== "TEST_ENVIRONMENT") throw "Once is not loaded as JestOnce implementation"
        this.once = ONCE as JestOnce;
    }


    async init() {
        if (this.initialized) return;
        this.componentBuilder = await this.once.srcEamd.getComponentBuilder();
        this.initialized = true
    }

    async async(path: Path, options: ResolverOptions): Promise<Path> {
        await this.init()
        if (this.cache.has(path)) {
            console.log("cached");

            return this.cache.get(path) as string;
        }
        const resolved = await this.resolvePath(path, options);

        // Call the defaultResolver, so we leverage its cache, error handling, etc.
        const result = options.defaultResolver(resolved, {
            ...options,
        });


        // console.log("path", path);
        // console.log("result", result);

        return result;
    }

    async resolvePath(path: string, options: ResolverOptions): Promise<string> {
        if (path === "./TEST_RESOLVE.mjs") return path = "./MyResolveResult.mjs";

        if (path.startsWith("ior") || path.startsWith("/ior")) {
            const result = (await
                this.once.resolve(path, { conditions: [], importAssertions: {}, parentURL: undefined }, (path: string) => { return { url: path } })).url;
            this.cache.set(path, result);
            return result
        }
        if (path.startsWith("..")) {
            const fullFilePath = join(options.basedir, path);
            const builder = (await this.componentBuilder.find(x => fullFilePath.includes(x.path)));

            if (builder === undefined) return path;

            let relativeFilePath = relative(builder.path, fullFilePath)

            const replace = "src" + sep
            if (relativeFilePath.startsWith(replace))
                relativeFilePath = relativeFilePath.replace(replace, "")

            return join(builder.distributionFolder, relativeFilePath)
        }
        return path;
    }
}


const jestResolver = new JestResolver();
jestResolver.async = jestResolver.async.bind(jestResolver)

module.exports = jestResolver

