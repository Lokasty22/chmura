Rozwiązanie zadania:
1. Utwórz przestrzeń nazw o nazwie remote.

loko@loko-VirtualBox:~$ kubectl create namespace remote  
namespace/remote created  

2. W przestrzeni nazw remote uruchom Pod-a na bazie obrazu Nginx o nazwie
remoteweb oraz udostępnij go tak (poprzez utworzenie obiektu Service), aby
można było uzyskać do niego dostęp na porcie węzła minikube 31999.
  
loko@loko-VirtualBox:$ kubectl run remoteweb --image=nginx --namespace=remote  
pod/remoteweb created  
Sprawdzenie:  
loko@loko-VirtualBox: kubectl get pods -n remote  
NAME        READY   STATUS    RESTARTS   AGE  
remoteweb   1/1     Running   0          95s
  
loko@loko-VirtualBox:$ kubectl create service nodeport remoteweb --tcp=80:80 --node-port=31999 -n remote
service/remoteweb created  
Sprawdzenie:  
loko@loko-VirtualBox:~$ kubectl get svc -n remote   
NAME        TYPE       CLUSTER-IP       EXTERNAL-IP   PORT(S)        AGE  
remoteweb   NodePort   10.102.126.239   <none>        80:31999/TCP   2m45s    

Service otrzymał adres ClusterIP oraz port NodePort 31999/TCP  

loko@loko-VirtualBox:~$ kubectl describe svc remoteweb -n remote   
Name:                     remoteweb  
Namespace:                remote  
Labels:                   app=remoteweb  
Annotations:              <none>  
Selector:                 app=remoteweb  
Type:                     NodePort  
IP Family Policy:         SingleStack  
IP Families:              IPv4  
IP:                       10.102.126.239  
IPs:                      10.102.126.239  
Port:                     80-80  80/TCP  
TargetPort:               80/TCP  
NodePort:                 80-80  31999/TCP  
Endpoints:                  
Session Affinity:         None  
External Traffic Policy:  Cluster  
Internal Traffic Policy:  Cluster    

3. W przestrzeni nazw domyślnej uruchom Pod-a testpod, oparty na obrazie Busybox
oraz używający polecenia sleep infinity jako domyślnego polecenia.

loko@loko-VirtualBox:$ kubectl run testpod --image=busybox --command -- sleep infinity  
pod/testpod created  
Sprawdzenie:  
loko@loko-VirtualBox:$ kubectl get pods  
NAME      READY   STATUS    RESTARTS   AGE  
testpod   1/1     Running   0          2m13s  

4. Z Pod-a testpod użyj polecenia wget --spider --timeout=1, aby zweryfikować,
czy można uzyskać dostęp do domowej strony internetowej Pod-a remoteweb.

Weryfikacja dostępu z Pod-a testpod za pomocą DNS Kubernetes:  

loko@loko-VirtualBox:~$ kubectl exec -it testpod run=remoteweb  -- sh  
/ # wget --spider --timeout=1 http://remoteweb.remote.svc.cluster.local  
Connecting to remoteweb.remote.svc.cluster.local (10.102.126.239:80)  
remote file exists  

Odpowiedź remote file exists potwierdziła poprawną komunikację wewnątrz klastra.  

6. Zweryfikuj, że ta strona internetowa jest dostępna na porcie węzła minikube 31999

Sprawdzenie dostępu z zewnątrz przez NodePort:  
   
loko@loko-VirtualBox:~$ curl http://$(minikube ip):31999  

Wyświetliła się domyślna strona „Welcome to nginx!”, co potwierdziło poprawne wystawienie usługi.  
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
Wnioski:

Pod uruchomiony w osobnej przestrzeni nazw może być udostępniony poza klaster dzięki usłudze typu NodePort.

DNS Kubernetes poprawnie rozwiązuje adresy usług w formacie <service>.<namespace>.svc.cluster.local.

Komunikacja między Pod-ami w różnych przestrzeniach nazw działa prawidłowo.

Konfiguracja została wykonana poprawnie, a serwer nginx działał zgodnie z oczekiwaniami.

