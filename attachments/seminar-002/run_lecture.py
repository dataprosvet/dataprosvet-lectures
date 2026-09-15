"""Local lecture-only HTTP services, without Docker/traffic visualization."""
import os
from pathlib import Path
import subprocess
import sys
import time

if __name__ == "__main__":
    root = Path(__file__).resolve().parent
    env = {**os.environ, "WEB_ORIGIN": "http://127.0.0.1:8003", "READ_API_URL": "http://127.0.0.1:8000"}
    # Local service calls must not go through an environment HTTP proxy.
    for name in ("NO_PROXY", "no_proxy"):
        env[name] = ",".join(filter(None, (env.get(name, ""), "127.0.0.1,localhost,::1")))
    children = []
    try:
        for module, port in (("read_api", 8000), ("bank_offices", 8001), ("office_manager", 8002)):
            children.append(subprocess.Popen([sys.executable, "-m", "uvicorn", module + ":app", "--host", "127.0.0.1", "--port", str(port)], cwd=root, env=env))
        print("Лекция: http://127.0.0.1:8000/lecture-02 ; остановка Ctrl+C", flush=True)
        while all(child.poll() is None for child in children):
            time.sleep(0.2)
        raise SystemExit("Один из сервисов остановился; проверьте журнал и занятость портов.")
    except KeyboardInterrupt:
        pass
    finally:
        for child in children:
            if child.poll() is None:
                child.terminate()
        for child in children:
            try:
                child.wait(timeout=5)
            except subprocess.TimeoutExpired:
                child.kill()
                child.wait()
