loko@loko-VirtualBox:~/l4_zad$ kubectl run loop --dry-run=client -o yaml --image=busybox:1.36.1 -- /bin/sh -c 'for i in $(seq 1 5); do echo "$i - A piece of cake !"; done' > loop.yaml
loko@loko-VirtualBox:~/l4_zad$ cat loop.yaml
apiVersion: v1
kind: Pod
metadata:
  labels:
    run: loop
  name: loop
spec:
  containers:
  - args:
    - /bin/sh
    - -c
    - for i in $(seq 1 5); do echo "$i - A piece of cake !"; done
    image: busybox:1.36.1
    name: loop
    resources: {}
  dnsPolicy: ClusterFirst
  restartPolicy: Always
status: {}
loko@loko-VirtualBox:~/l4_zad$ kubectl apply -f loop.yaml
pod/loop created
oko@loko-VirtualBox:~/l4_zad$ kubectl get pods loop
NAME   READY   STATUS      RESTARTS      AGE
loop   0/1     Completed   4 (59s ago)   102s
loko@loko-VirtualBox:~/l4_zad$ kubectl logs loop
1 - A piece of cake !
2 - A piece of cake !
3 - A piece of cake !
4 - A piece of cake !
5 - A piece of cake !
loko@loko-VirtualBox:~/l4_zad$ kubectl delete pod loop
pod "loop" deleted from default namespace
loko@loko-VirtualBox:~/l4_zad$ kubectl run loop --dry-run=client -o yaml --image=busybox:1.36.1 -- /bin/sh -c 'while true; do for i in $(seq 1 5); do echo "$i - A piece of cake !"; done; sleep 5; done' > loop.yaml
loko@loko-VirtualBox:~/l4_zad$ kubectl apply -f loop.yaml 
pod/loop created
loko@loko-VirtualBox:~/l4_zad$ kubectl get pods loop
NAME   READY   STATUS    RESTARTS   AGE
loop   1/1     Running   0          11s

#Opis
Pierwszy pod loop uruchamia obraz `busybox:1.36.1` i wykonuje 
for i in {1..5}; do echo "$i - A piece of cake !"; done
Pierwsza wersja kończy się po 5 iteracjach (STATUS = Completed).
Druga wersja z pętlą while true działa bez końca (STATUS = Running).
