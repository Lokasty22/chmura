1. Należy utworzyć klaster z trzema węzłami roboczymi (węzeł główny + wezły A,B,C), pluginem CNI Calico oraz sterownikiem Docker.
   loko@loko-VirtualBox:$ minikube start --driver=docker --cni=calico --nodes=4  
   Sprawdzenie czy wszystkie węzły sie utworzyły:   
loko@loko-VirtualBox:$ kubectl get nodes -o wide  
NAME           STATUS   ROLES           AGE     VERSION   INTERNAL-IP    EXTERNAL-IP   OS-IMAGE             KERNEL-VERSION      CONTAINER-RUNTIME  
minikube       Ready    control-plane   11m     v1.34.0   192.168.49.2   <none>        Ubuntu 22.04.5 LTS   6.14.0-36-generic   docker://28.4.0  
minikube-m02   Ready    <none>          9m42s   v1.34.0   192.168.49.3   <none>        Ubuntu 22.04.5 LTS   6.14.0-36-generic   docker://28.4.0  
minikube-m03   Ready    <none>          8m29s   v1.34.0   192.168.49.4   <none>        Ubuntu 22.04.5 LTS   6.14.0-36-generic   docker://28.4.0  
minikube-m04   Ready    <none>          6m40s   v1.34.0   192.168.49.5   <none>        Ubuntu 22.04.5 LTS   6.14.0-36-generic   docker://28.4.0

2. W klastrze należy wdrożyć:  
• Deployment o nazwie frontend na bazie obrazu nginx oraz 3 replikach. Pod-y tego
Deployment-u powinny znaleźć się na węźle A.
• Deployment o nazwie backend na bazie obrazu nginx oraz 1 replice. Pod-y tego
Deployment-u powinny znaleźć się na węźle B.  
• Pod o nazwie my-sql na bazie obrazu mysql . Pod ten powinny znaleźć się na węźle C.

loko@loko-VirtualBox:~$ kubectl create deployment frontend --image=nginx --replicas=3 --dry-run=client -o yaml > frontend.yaml  
loko@loko-VirtualBox:~$ kubectl apply -f frontend.yaml  
deployment.apps/frontend created  

 loko@loko-VirtualBox:~$ kubectl create deployment backend --image=nginx --replicas=1 --dry-run=client -o yaml > backend.yaml  
 loko@loko-VirtualBox:~$ kubectl apply -f backend.yaml  
deployment.apps/backend created  
loko@loko-VirtualBox:~$ kubectl run my-sql --image=mysql --dry-run=client -o yaml > mysql.yaml  
loko@loko-VirtualBox:~$ kubectl apply -f mysql.yaml  
pod/my-sql created  

loko@loko-VirtualBox:~$ kubectl get pods -o wide  
NAME                        READY   STATUS    RESTARTS   AGE     IP               NODE           NOMINATED NODE   READINESS GATES  
backend-7799b98db-nvvwp     1/1     Running   0          8m42s   10.244.151.2     minikube-m03   <none>           <none>  
frontend-6849d6fc55-nxn9s   1/1     Running   0          32s     10.244.205.196   minikube-m02   <none>           <none>  
frontend-6849d6fc55-r4dmv   1/1     Running   0          46s     10.244.205.194   minikube-m02   <none>           <none>  
frontend-6849d6fc55-v4vzc   1/1     Running   0          39s     10.244.205.195   minikube-m02   <none>           <none>  
my-sql                      1/1     Running   0          4m12s   10.244.59.130    minikube-m04   <none>           <none>  

3. Dla Deployment-u frontend należy utworzyć obiekty Service typu NodePort.
   loko@loko-VirtualBox:~$ kubectl expose deployment frontend --type=NodePort --port=80 --target-port=80 --name=frontend-svc                                                  
service/frontend-svc exposed
4. Dla Deployment-u backend oraz Pod-a my-sql należy utworzyć Service typu ClusterIP.
   loko@loko-VirtualBox:~$ kubectl expose deployment backend --type=ClusterIP --port=80 --target-port=80 --name=backend-svc                                                              
service/backend-svc exposed
loko@loko-VirtualBox:~$ kubectl expose pod my-sql --type=ClusterIP --port=3306 --target-port=3306 --name=mysql-svc  
service/mysql-svc exposed  
sprawdzenie:
loko@loko-VirtualBox:~$ kubectl get svc  
NAME           TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)        AGE  
backend-svc    ClusterIP   10.109.130.124   <none>        80/TCP         3m5s  
frontend-svc   NodePort    10.110.28.63     <none>        80:32091/TCP   4m37s  
kubernetes     ClusterIP   10.96.0.1        <none>        443/TCP        40m  
mysql-svc      ClusterIP   10.109.105.141   <none>        3306/TCP       67s  
 

5. Należy opracować politykę
sieciową (obiekt NetworkPolicy),
która zapewni, że:  
• Z Pod-ów frontend nie ma możliwości
połączenia się z Pod-em my-sql
• Z Pod-ów backend jest możliwości połączenia się z Pod-em my-sql ale tylko na port 3306

loko@loko-VirtualBox:~$ nano netpol.yaml  
loko@loko-VirtualBox:~$ kubectl apply -f netpol.yaml  
networkpolicy.networking.k8s.io/mysql-access created  


loko@loko-VirtualBox:~$ kubectl get pods -l app=frontend  
NAME                        READY   STATUS    RESTARTS   AGE  
frontend-6849d6fc55-nxn9s   1/1     Running   0          10m  
frontend-6849d6fc55-r4dmv   1/1     Running   0          11m  
frontend-6849d6fc55-v4vzc   1/1     Running   0          10m  

   loko@loko-VirtualBox:~$ kubectl exec -it frontend-6849d6fc55-nxn9s -- sh -c "apt-get update && apt-get install -y curl"Get:1 http://deb.debian.org/debian trixie InRelease [140 kB]  
Get:2 http://deb.debian.org/debian trixie-updates InRelease [47.3 kB]  
Get:3 http://deb.debian.org/debian-security trixie-security InRelease [43.4 kB]  
Get:4 http://deb.debian.org/debian trixie/main amd64 Packages [9670 kB]  
Get:5 http://deb.debian.org/debian trixie-updates/main amd64 Packages [5412 B]                                          
Get:6 http://deb.debian.org/debian-security trixie-security/main amd64 Packages [81.7 kB]                               
Fetched 9988 kB in 10s (956 kB/s)                                                                                       
Reading package lists... Done  
Reading package lists... Done  
Building dependency tree... Done  
Reading state information... Done  
curl is already the newest version (8.14.1-2+deb13u2).  
0 upgraded, 0 newly installed, 0 to remove and 0 not upgraded.  

loko@loko-VirtualBox:~$ kubectl get pods -l app=backend  
NAME                      READY   STATUS    RESTARTS   AGE  
backend-7799b98db-nvvwp   1/1     Running   0          24m  


loko@loko-VirtualBox:~$ kubectl exec -it backend-7799b98db-nvvwp -- sh -c "apt-get update && apt-get install -y curl"  
Get:1 http://deb.debian.org/debian trixie InRelease [140 kB]  
Get:2 http://deb.debian.org/debian trixie-updates InRelease [47.3 kB]  
Get:3 http://deb.debian.org/debian-security trixie-security InRelease [43.4 kB]  
Get:4 http://deb.debian.org/debian trixie/main amd64 Packages [9670 kB]  
Get:5 http://deb.debian.org/debian trixie-updates/main amd64 Packages [5412 B]  
Get:6 http://deb.debian.org/debian-security trixie-security/main amd64 Packages [81.7 kB]  
Fetched 9988 kB in 6s (1685 kB/s)                          
Reading package lists... Done  
Reading package lists... Done  
Building dependency tree... Done  
Reading state information... Done  
curl is already the newest version (8.14.1-2+deb13u2).  
0 upgraded, 0 newly installed, 0 to remove and 0 not upgraded.  










 


