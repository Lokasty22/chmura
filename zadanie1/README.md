CZĘŚĆ OBOWIĄZKOWA  
A:  
loko@loko-VirtualBox:$ minikube start --driver=docker --cni=calico --nodes=4  

Sprawdzenie czy węzły się  utworzyły:
loko@loko-VirtualBox:$ kubectl get nodes -o wide  
NAME           STATUS   ROLES           AGE     VERSION   INTERNAL-IP    EXTERNAL-IP   OS-IMAGE             KERNEL-VERSION      CONTAINER-RUNTIME  
minikube       Ready    control-plane   4m10s   v1.34.0   192.168.58.2   <none>        Ubuntu 22.04.5 LTS   6.14.0-36-generic   docker://28.4.0  
minikube-m02   Ready    <none>          3m24s   v1.34.0   192.168.58.3   <none>        Ubuntu 22.04.5 LTS   6.14.0-36-generic   docker://28.4.0  
minikube-m03   Ready    <none>          2m15s   v1.34.0   192.168.58.4   <none>        Ubuntu 22.04.5 LTS   6.14.0-36-generic   docker://28.4.0  
minikube-m04   Ready    <none>          20s     v1.34.0   192.168.58.5   <none>        Ubuntu 22.04.5 LTS   6.14.0-36-generic   docker://28.4.0  


pod generujacy obciazenie

<p>If you see this page, the nginx web server is successfully installed and  
working. Further configuration is required.</p>  

<p>For online documentation and support please refer to  
<a href="http://nginx.org/">nginx.org</a>.<br/>  
Commercial support is available at  
<a href="http://nginx.com/">nginx.com</a>.</p>  

<p><em>Thank you for using nginx.</em></p>  
</body>  
</html>  
<!DOCTYPE html>  
<html>  
<head>  
<title>Welcome to nginx!</title>  
<style>  
html { color-scheme: light dark; }  
body { width: 35em; margin: 0 auto;  
font-family: Tahoma, Verdana, Arial, sans-serif; }  
</style>  
</head>  
<body>  
<h1>Welcome to nginx!</h1>  
<p>If you see this page, the nginx web server is successfully installed and  
working. Further configuration is required.</p>  

<p>For online documentation and support please refer to  
<a href="http://nginx.org/">nginx.org</a>.<br/>   
Commercial support is available at  
<a href="http://nginx.com/">nginx.com</a>.</p>  

<p><em>Thank you for using nginx.</em></p>  
</body>  
</html>  


oko@loko-VirtualBox:~$ kubectl get hpa -n frontend -w
NAME           REFERENCE             TARGETS       MINPODS   MAXPODS   REPLICAS   AGE
frontend-hpa   Deployment/frontend   cpu: 0%/10%   3         10        3          82m
frontend-hpa   Deployment/frontend   cpu: 3%/10%   3         10        3          90m
frontend-hpa   Deployment/frontend   cpu: 12%/10%   3         10        3          91m
frontend-hpa   Deployment/frontend   cpu: 12%/10%   3         10        4          91m
frontend-hpa   Deployment/frontend   cpu: 8%/10%    3         10        4          92m
frontend-hpa   Deployment/frontend   cpu: 4%/10%    3         10        4          93m
frontend-hpa   Deployment/frontend   cpu: 0%/10%    3         10        4          94m
frontend-hpa   Deployment/frontend   cpu: 0%/10%    3         10        4          97m
frontend-hpa   Deployment/frontend   cpu: 0%/10%    3         10        3          97m



