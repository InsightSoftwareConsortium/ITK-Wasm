from dataclasses import dataclass
from typing import Optional

@dataclass
class JsPackageConfig:
    module_url: str
    pipelines_base_url: Optional[str] = None
    pipeline_worker_url: Optional[str] = None
