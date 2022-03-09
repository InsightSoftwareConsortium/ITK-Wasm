import loadEmscriptenModule from '../core/internal/loadEmscriptenModuleWebWorker.js';
// To cache loaded pipeline modules
const pipelineToModule = new Map();
async function loadPipelineModule(pipelinePath, baseUrl) {
    let moduleRelativePathOrURL = pipelinePath;
    let pipeline = pipelinePath;
    let pipelineModule = null;
    if (typeof pipelinePath !== 'string') {
        moduleRelativePathOrURL = new URL(pipelinePath.href);
        pipeline = moduleRelativePathOrURL.href;
    }
    if (pipelineToModule.has(pipeline)) {
        pipelineModule = pipelineToModule.get(pipeline);
    }
    else {
        pipelineToModule.set(pipeline, await loadEmscriptenModule(moduleRelativePathOrURL, baseUrl));
        pipelineModule = pipelineToModule.get(pipeline);
    }
    return pipelineModule;
}
export default loadPipelineModule;
