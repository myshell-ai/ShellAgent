import argparse
import os
import threading
import sys
import psutil
import time
import signal

            
        
def memory_watchdog(cpu_limit_gb=30, gpu_limit_gb=20, device_num=0):
    """Watches the CPU and GPU memory usage and exits the program if limits are exceeded."""
    process = psutil.Process(os.getpid())
    cpu_limit_bytes = cpu_limit_gb * 1024 * 1024 * 1024  # Convert GB to bytes
    gpu_limit_bytes = gpu_limit_gb * 1024 * 1024 * 1024  # Convert GB to bytes

    while True:
        # Monitor CPU memory usage
        cpu_memory_usage = process.memory_info().rss
        # print(f"Current CPU memory usage: {cpu_memory_usage / (1024 * 1024 * 1024):.2f} GB")

        # Monitor GPU memory usage (assuming there's at least one GPU)
        gpus = GPUtil.getGPUs()

        if gpus:
            gpu = gpus[device_num]
            gpu_memory_usage = gpu.memoryUsed * 1024 * 1024  # GPU usage in bytes
            # print(f"Current GPU memory usage: {gpu_memory_usage / (1024 * 1024 * 1024):.2f} GB")
        else:
            gpu_memory_usage = 0
            # print("No GPU found.")

        # Check if memory limits are exceeded
        if cpu_memory_usage > cpu_limit_bytes or gpu_memory_usage > gpu_limit_bytes:
            print("Memory limit exceeded! Exiting program.")
            os._exit(1)

        time.sleep(1)  # Check memory usage every 5 seconds
        # print("CPU usage", cpu_memory_usage / (1024 * 1024 * 1024))

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument("--port", type=int, default=8099)
    parser.add_argument("--device", type=int, default=0)
    parser.add_argument("--project_root", type=str, default="data")
    parser.add_argument("--cpu", default=False, action="store_true")
    args = parser.parse_args()
    
    os.environ["PROCONFIG_PROJECT_ROOT"] = str(args.project_root)
    os.environ["CUDA_VISIBLE_DEVICES"] = str(args.device)
    
    import servers.base
    import servers.common
    import servers.manager
    import servers.automata
    import servers.workflow
    import servers.settings
    import servers.tools
    import servers.comfy_runner
    
    import GPUtil


    # Start the watchdog thread
    if os.environ.get("ENABLE_WATCHDOG") == "1":
        watchdog_thread = threading.Thread(target=memory_watchdog, daemon=True, args=(30, 20, args.device))
        watchdog_thread.start()
    
    from servers.base import app
    print(os.getpid())
    app.run(port=args.port, host="0.0.0.0", debug=False)

