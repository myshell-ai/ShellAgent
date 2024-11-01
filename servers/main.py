import argparse
import os
from fastapi.staticfiles import StaticFiles
import webbrowser
from contextlib import asynccontextmanager


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument("--port", type=int, default=8099)
    parser.add_argument("--device", type=int, default=0)
    parser.add_argument("--project_root", type=str, default="data")
    parser.add_argument("--disable_auto_launch", action="store_true", default=False)
    args = parser.parse_args()
    
    os.environ["PROCONFIG_PROJECT_ROOT"] = str(args.project_root)
    os.environ["CUDA_VISIBLE_DEVICES"] = str(args.device)
    
    import servers.base
    import servers.common
    import servers.automata
    import servers.workflow
    import servers.settings
    import servers.comfy_runner
    

    
    from servers.base import app, web_build_path
    import uvicorn
    
    app.mount("/", StaticFiles(directory=str(web_build_path), html=True), name="static")

    # Define the lifespan context to open the browser on startup
    @asynccontextmanager
    async def lifespan(app):
        # Run this code on startup
        webbrowser.open(f"http://127.0.0.1:{args.port}")
        yield
        # Code here would run on shutdown (if needed)

    if not args.disable_auto_launch:
        app.router.lifespan_context = lifespan
            
    config = uvicorn.Config(
        app,
        host="0.0.0.0",
        port=args.port,
        proxy_headers=True,
        forwarded_allow_ips="*",
    )


    uvicorn_server = uvicorn.Server(config=config)
    uvicorn_server.run()
