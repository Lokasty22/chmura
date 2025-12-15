CZĘŚĆ OBOWIĄZKOWA  
A:  Utworzenie klastra  
loko@loko-VirtualBox:$ minikube start --driver=docker --cni=calico --nodes=4  

Sprawdzenie czy węzły się  utworzyły:  
loko@loko-VirtualBox:$ kubectl get nodes -o wide  
NAME           STATUS   ROLES           AGE     VERSION   INTERNAL-IP    EXTERNAL-IP   OS-IMAGE             KERNEL-VERSION      CONTAINER-RUNTIME  
minikube       Ready    control-plane   4m10s   v1.34.0   192.168.58.2   <none>        Ubuntu 22.04.5 LTS   6.14.0-36-generic   docker://28.4.0  
minikube-m02   Ready    <none>          3m24s   v1.34.0   192.168.58.3   <none>        Ubuntu 22.04.5 LTS   6.14.0-36-generic   docker://28.4.0  
minikube-m03   Ready    <none>          2m15s   v1.34.0   192.168.58.4   <none>        Ubuntu 22.04.5 LTS   6.14.0-36-generic   docker://28.4.0  
minikube-m04   Ready    <none>          20s     v1.34.0   192.168.58.5   <none>        Ubuntu 22.04.5 LTS   6.14.0-36-generic   docker://28.4.0  

B: Utworzenie zestawów manifestów   
  Przestrzeń nazw: -> plik namespaces.yaml    
  loko@loko-VirtualBox:$kubectl create -f namespaces.yaml  

  1. W przestrzeni nazw frontend, Deployment o nazwie frontend na bazie 
  obrazu nginx oraz 3 replikach. Pod-y tego Deployment-u powinny znaleźć
  się na dowolnym węźle ale nie na tym, na którym będą działać Pod-y
  backend oraz my-sql .  -> plik deployment-frontend.yaml   
    loko@loko-VirtualBox:$kubectl create -f deployment-frontend.yaml

  2. W przestrzeni nazw backend, Deployment o nazwie backend na bazie 
  obrazu nginx oraz 1 replice. Pod tego Deployment-u powinien znaleźć się
  na tym samym węźle klastra co Pod my-sql.  -> plik deployment-backend.yaml  
   loko@loko-VirtualBox:$kubectl create -f deployment-backend.yaml

  3. W przestrzeni nazw backend, Pod o nazwie my-sql na bazie obrazu mysql.
  Pod ten powinien znaleźć się na tym samym węźle klastra co Pod-y
  Deployment-u backend.   -> plik pod-mysql.yaml  
    loko@loko-VirtualBox:$kubectl create -f pod-mysql.yaml

  4. Dla Deployment-u frontend należy utworzyć obiekty Service typu
NodePort.  -> plik service-frontend.yaml
    loko@loko-VirtualBox:$kubectl create -f service-frontend.yaml

  5. Dla Deployment-u backend oraz Pod-a my-sql należy utworzyć obiekty
Service typu ClusterIP.  -> pliki service-backend.yaml i service-mysql.yaml  
   loko@loko-VirtualBox:$kubectl create -f service-mysql.yaml  
   loko@loko-VirtualBox:$kubectl create -f service-backend.yaml

C: Polityka sieciowa  
  1. Z Pod-ów Deployment-u frontend w przestrzeni nazw frontend można
  połączyć się wyłącznie z Pod-ami w przestrzeni backend, należącymi do
  Deployment-u backend na port 80.  ->plik networkpolicy-frontend.yaml  
     loko@loko-VirtualBox:$kubectl create -f networkpolicy-frontend.yaml
     
  2. Z Pod-ów backend w przestrzeni nazw backend jest możliwości połączenia
  się z Pod-em my-sql ale tylko na port 3306 oraz z Pod-ami Deploymentu
  frontend w przestrzeni nazw frontend.  ->plik networkpolicy-backend.yaml
      loko@loko-VirtualBox:$kubectl create -f networkpolicy-backend.yaml

D: Ograniczenia ilości podów w przestrzeniach nazw  ->plik resourcequotas.yaml  
    1. W przestrzeni nazw frontend:  
  - maksymalna liczba Pod-ów: 10  
  - dostępne zasoby CPU: 1 CPU (1000m)  
  - dostępna ilość pamięci RAM: 1,5Gi  
  2. W przestrzeni nazw backend:  
  - maksymalna liczba Pod-ów: 3  
  - dostępne zasoby CPU: 1 CPU (1000m)  
  - dostępna ilość pamięci RAM: 1,0Gi
       loko@loko-VirtualBox:$kubectl create -f resourcequotas.yaml  

E: Autoskaler HPA dla Deployment-u frontend  ->plik hpa.yaml  
   loko@loko-VirtualBox:$kubectl create -f hpa.yaml  

G: test Deployment-u frontend   
   loko@loko-VirtualBox:$kubectl run -it load-generator --rm --image=busybox --restart=Never
    -n default --  sh -c "while true; do wget -q -O- http://frontend-svc.frontend.svc.cluster.local; done"    

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

Sprawdzenie działania skalowania:  
loko@loko-VirtualBox:~$ kubectl get hpa -n frontend -w    
NAME           REFERENCE             TARGETS       MINPODS   MAXPODS   REPLICAS   AGE  
frontend-hpa   Deployment/frontend   cpu: 0%/10%   3         10        3          82m  
frontend-hpa   Deployment/frontend   cpu: 3%/10%   3         10        3          90m  
frontend-hpa   Deployment/frontend   cpu: 12%/10%   3         10        3          91m  
frontend-hpa   Deployment/frontend   cpu: 23%/10%   3         10        4          91m  

Po usunięciu poda:  
loko@loko-VirtualBox:~$ kubectl get hpa -n frontend -w    
NAME           REFERENCE             TARGETS       MINPODS   MAXPODS   REPLICAS   AGE  
frontend-hpa   Deployment/frontend   cpu: 0%/10%   3         10        3          82m  
frontend-hpa   Deployment/frontend   cpu: 3%/10%   3         10        3          90m  
frontend-hpa   Deployment/frontend   cpu: 12%/10%   3         10        3          91m  
frontend-hpa   Deployment/frontend   cpu: 23%/10%   3         10        4          91m  
frontend-hpa   Deployment/frontend   cpu: 8%/10%    3         10        4          92m  
frontend-hpa   Deployment/frontend   cpu: 4%/10%    3         10        4          93m  
frontend-hpa   Deployment/frontend   cpu: 0%/10%    3         10        4          94m  
frontend-hpa   Deployment/frontend   cpu: 0%/10%    3         10        4          97m  
 
CZĘŚĆ NIEOBOWIĄZKOWA  
Zad 1:Czy możliwe jest dokonanie aktualizacji aplikacji frontend (np. wersji obrazu
kontenera) gdy aplikacja jest pod kontrolą opracowanego autoskalera HPA ? Proszę do
odpowiedzi (TAK lub NIE) dodać link do fragmentu dokumentacji, w którym jest
rozstrzygnięta ta kweska.  

TAK — aktualizacja aplikacji (rolling update) jest możliwa nawet wtedy, gdy Deployment jest skalowany przez HPA.

Oficjalna dokumentacja Kubernetes potwierdza to jednoznacznie:  https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/#autoscaling-during-rolling-update

Zad 2. Jeśli odpowiedź na poprzednie pytanie jest pozytywna to proszę podać przykładowe
parametry strategii rollingUpdate, które zagwarantują, że: 

Parametry strategii rollingUpdate:  
strategy:  
  type: RollingUpdate  
  rollingUpdate:  
    maxUnavailable: 1  
    maxSurge: 0  

a) Podczas aktualizacji zawsze będa aktywne 2 pod-y realizujące działanie aplikacji
frontend oraz  

Deployment frontend ma 3 repliki.Aby zagwarantować, że podczas aktualizacji nigdy nie będą działały mniej niż 2 Pody: maxUnavailable: 1  

Uzasadnienie:  
Podczas rolloutu Kubernetes może usunąć maksymalnie 1 Pod naraz → pozostają co najmniej 2 działające. 

b) Nie zostaną przekroczone parametry wcześniej zdefiniowanych ograniczeń
zdefiniowanych dla przestrzeni nazw frontend. (ilość Pod-ów, CPU lub RAM).  
obecnie:  
(pods=10, CPU=1000m, RAM=1.5Gi)  
W namespace frontend istnieje limit:
maksymalnie 10 Podów  

Jeśli HPA zeskaluje Deployment do 10 Podów, a rolling update spróbuje dodać Pod surge, to proces aktualizacji zostanie zablokowany, ponieważ Deployment nie może przekroczyć limitów pods=10.    
Dlatego bezpiecznym ustawieniem jest:  
maxSurge: 0  

Uzasadnienie:  Podczas aktualizacji nie powstanie ani jeden dodatkowy Pod,
Kubernetes będzie aktualizował Pody 1:1, zachowując maksymalny limit 10 Podów,
rolling update nigdy nie naruszy ResourceQuota.  

c) Jeśli okaże się, że należy skorelować (zmieć) ustawienia autoskalera HPA
zdefiniowanego w części obowiązkowej w związku z zaplanowaną strategią
aktualizacji to należy również przedstawić i uzasadnić te ewentualne zmiany.  

 W zastosowanej strategii maxSurge = 0 aktualizacja Deploymentu przebiega w trybie 1:1 (jeden Pod jest usuwany, następnie tworzony jest nowy).
Oznacza to, że nie powstają Pody tymczasowe, dlatego konfiguracja HPA:  
minReplicas: 3  
maxReplicas: 10  
averageUtilization: 10  

nie wymaga żadnych zmian i pozostaje w pełni zgodna z ResourceQuota.

W przypadku użycia strategii:  
maxSurge: 1

Deployment mógłby podczas aktualizacji stworzyć jeden Pod dodatkowy, tzn.:  
HPA skaluje frontend do 10 Podów,
Deployment dodaje 1 Pod surge,
łącznie powstaje 11 Podów → przekroczenie ResourceQuota → rollout zostaje zablokowany.  
Dlatego w takim wariancie konieczna jest korekta HPA:  
maxReplicas: 9

Uzasadnienie:  
9 (HPA) + 1 (surge) = 10 Podów → czyli dokładnie tyle, ile dopuszcza ResourceQuota.
