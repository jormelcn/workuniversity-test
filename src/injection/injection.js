class ResolverNotFoundError extends Error {}
class ResolverError extends Error {}

class MainResolver {

    constructor(){
        this.resolvers = {};
        this.cache = {};
    }

    resolveDependency(idDependency){
        let name;
        if (typeof(idDependency) === 'function')
            name = idDependency.name;
        else
            name = idDependency;
        if (!this.resolvers[name])
            throw new ResolverNotFoundError(`MainResolver: Not foud resolver with ${name} id`);
        const resolver = this.resolvers[name];
        if(resolver.isSingleton && this.cache[name])
            return this.cache[name];

        let result;
        try {
            result = resolver.resolver.call(this);    
        }catch(e){
            throw new ResolverError(`MainResolver: Error on call ${name} resolver: ${e}`);
        }
        if (typeof(idDependency) === 'function' && ! (result instanceof idDependency))
            throw new ResolverError(
                `MainResolver: resolver output not is instance of ${idDependency}`);

        if(resolver.isSingleton)
            this.cache[name] = result;
        return result;
    }

    registerResolver(name, resolver, isSingleton){
        this.resolvers[name] = {
            resolver,
            isSingleton
        }
    }

}

const mainResolver = new MainResolver()


function registerResolvers(resolvers, singleton=true){
    for (let key in resolvers){
        mainResolver.registerResolver(
            key, 
            resolvers[key],
            singleton
        )
    }
}

function resolveByName(name){
    return mainResolver.resolve(name);
}

function resolveByClass(_class_){
    return mainResolver.resolveDependency(_class_);
}

module.exports = {
    registerResolvers,
    resolveByName,
    resolveByClass
}
