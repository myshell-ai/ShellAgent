import argparse
import os
import threading
import sys
import psutil
import time
import signal


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument("--port", type=int, default=8099)
    parser.add_argument("--device", type=int, default=0)
    parser.add_argument("--project_root", type=str, default="data")
    args = parser.parse_args()
    
    os.environ["PROCONFIG_PROJECT_ROOT"] = str(args.project_root)
    os.environ["CUDA_VISIBLE_DEVICES"] = str(args.device)
    
    import servers.base
    import servers.common
    import servers.automata
    import servers.workflow
    import servers.settings
    import servers.comfy_runner
    

    
    from servers.base import app
    import uvicorn
    
    config = uvicorn.Config(
        app,
        host="0.0.0.0",
        port=args.port,
        proxy_headers=True,
        forwarded_allow_ips="*",
    )
    uvicorn_server = uvicorn.Server(config=config)
    uvicorn_server.run()
