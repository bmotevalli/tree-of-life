bind = "0.0.0.0:8080"
# Reduced backlog as Kubernetes will handle connection distribution
backlog = 512
# Reduced connections per worker since we'll have multiple pods
worker_connections = 200
# Timeout still needs to be high for long-running requests
timeout = 1200
# In Kubernetes, we don't want to scale based on host CPU but rather use a fixed number
# of workers per pod that's optimized for the pod's resource allocation
workers = 2
threads = 4
accesslog = "-"
access_log_format = '%(h)s %(l)s %(u)s %(t)s "%(r)s" %(s)s %(b)s "%(f)s" "%(a)s"'
loglevel = "info"
capture_output = True
enable_stdio_inheritance = True
# Lower keepalive to prevent connections lingering too long across pods
keepalive = 65
# Optimize for container restarts with faster recycling
max_requests = 500
max_requests_jitter = 50
graceful_timeout = 60
# Preload is not ideal in Kubernetes - each worker should start independently
preload_app = False
# Important for proper Kubernetes termination
worker_tmp_dir = "/dev/shm"
# Add statsd metrics for Prometheus scraping if you're using it
# statsd_host = "localhost:9125"
