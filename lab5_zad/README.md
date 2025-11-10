loko@loko-VirtualBox:~/zadl5$ kubectl create namespace ns-dev
namespace/ns-dev created
loko@loko-VirtualBox:~/zadl5$ 
loko@loko-VirtualBox:~/zadl5$ kubectl create namespace ns-prod
namespace/ns-prod created
loko@loko-VirtualBox:~/zadl5$ kubectl get ns | grep ns-
ns-dev            Active   15s
ns-prod           Active   7s

loko@loko-VirtualBox:~/zadl5$ kubectl create quota rq-dev \
  --namespace=ns-dev \
  --hard=requests.cpu=1,requests.memory=1Gi,limits.cpu=2,limits.memory=2Gi,pods=10 \
  --dry-run=client -o yaml > rq-dev.yaml
loko@loko-VirtualBox:~/zadl5$ kubectl apply -f rq-dev.yaml
resourcequota/rq-dev created
loko@loko-VirtualBox:~/zadl5$ kubectl get resourcequota -n ns-dev
NAME     REQUEST                                                 LIMIT                                   AGE
rq-dev   pods: 0/10, requests.cpu: 0/1, requests.memory: 0/1Gi   limits.cpu: 0/2, limits.memory: 0/2Gi   6s
loko@loko-VirtualBox:~/zadl5$ kubectl create quota rq-prod \
  --namespace=ns-prod \
  --hard=requests.cpu=2,requests.memory=2Gi,limits.cpu=4,limits.memory=4Gi,pods=20 \
  --dry-run=client -o yaml > rq-prod.yaml
loko@loko-VirtualBox:~/zadl5$ kubectl apply -f rq-prod.yaml
resourcequota/rq-prod created
loko@loko-VirtualBox:~/zadl5$ kubectl apply -f lr-dev.yaml
limitrange/lr-dev created
loko@loko-VirtualBox:~/zadl5$ kubectl describe limitrange lr-dev -n ns-dev
Name:       lr-dev
Namespace:  ns-dev
Type        Resource  Min  Max    Default Request  Default Limit  Max Limit/Request Ratio
----        --------  ---  ---    ---------------  -------------  -----------------------
Container   cpu       -    200m   100m             200m           -
Container   memory    -    256Mi  128Mi            256Mi          -

loko@loko-VirtualBox:~/zadl5$ kubectl create deployment no-test \
  --image=nginx \
  --namespace=ns-dev \
  --dry-run=client -o yaml > no-test.yaml
loko@loko-VirtualBox:~/zadl5$ nano no-test.yaml

loko@loko-VirtualBox:~/zadl5$ kubectl apply -f no-test.yaml
deployment.apps/no-test created
loko@loko-VirtualBox:~/zadl5$ kubectl get pods -n ns-dev 
NAME                       READY   STATUS    RESTARTS   AGE
no-test-748b77c656-ddw28   0/1     Pending   0          14s
loko@loko-VirtualBox:~/zadl5$ kubectl create deployment yes-test \
  --image=nginx \
  --namespace=ns-dev \
  --dry-run=client -o yaml > yes-test.yaml
loko@loko-VirtualBox:~/zadl5$ nano yes-test.yaml
loko@loko-VirtualBox:~/zadl5$ kubectl apply -f yes-test.yaml
deployment.apps/yes-test created
loko@loko-VirtualBox:~/zadl5$ kubectl get pods -n ns-dev -l app=yes-test
NAME                       READY   STATUS    RESTARTS   AGE
yes-test-fdf94b56d-jtf49   1/1     Running   0          7s
loko@loko-VirtualBox:~/zadl5$ kubectl create deployment zero-test \
  --image=nginx \
  --namespace=ns-dev \
  --dry-run=client -o yaml > zero-test.yaml
loko@loko-VirtualBox:~/zadl5$ kubectl apply -f zero-test.yaml
deployment.apps/zero-test created
loko@loko-VirtualBox:~/zadl5$ kubectl get pods -n ns-dev -l app=zero-test
NAME                         READY   STATUS    RESTARTS   AGE
zero-test-645589f969-pjlkf   1/1     Running   0          7s

#Opis

W ramach zadania utworzyłem w Kubernetes dwa środowiska: ns-dev oraz ns-prod. 
Następnie w ns-dev skonfigurowałem ograniczenia zasobów za pomocą ResourceQuota i LimitRange, a w ns-prod przydzieliłem dwukrotnie większe zasoby. 
W ns-dev utworzyłem trzy deploymenty testowe: no-test, yes-test i zero-test. 
Deployment no-test przekraczał limity zasobów i jego pod pozostał w stanie Pending. 
Deployment yes-test mieścił się w dopuszczalnych granicach i działał poprawnie (Running). 
Deployment zero-test nie miał zdefiniowanych limitów, ale dzięki LimitRange otrzymał wartości domyślne i również działał poprawnie (Running). 
Wyniki potwierdziły, że mechanizmy ResourceQuota i LimitRange skutecznie kontrolują przydział zasobów, zapewniając stabilność i izolację środowisk w Kubernetes.
