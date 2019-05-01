## Final Demo for the App

1. Open 1 Terminal and Run `npm run dev`
2. Open 2nd Terminal and change the HTTP and P2P Port. So Run `HTTP_PORT=3002 P2P_PORT=5002 PEERS=ws://localhost:5001 npm run dev`

Both Instances Connect with Each Other

### Transact Between the Two Instances

Open Postman and Do the Following

3. Get the address of the second instance to send currency to the instance. So a `GET` Request to `localhost:3002/public-key`. Copy the obtained Public Key.
4. Use the transact end-point of the first instance. Create a `POST` Request to `localhost:3001/transact` with body as raw->json(application/json) with JSON as recipient with the address copied previously and some amount (say 50). Hit it a couple of times. We get 400 left for the first instance and have 2 output objects for the second instances
5. To check whether the transactions exist in the transaction endpoint (or the transaction pool basically), send a `GET` Request to `localhost:3001/transactions` and `localhost:3002/transactions`and both should have the same objects.
6. Mine the transactions using any one of the instances, let's say using the first one. So make a `GET` request to `localhost:3001/mine-transactions`. You should see the rewarded transaction.
7. To check balance, we again run the `POST` Request in step 4. and the input amount will be 450 (as 50 reward amount is added) and thus the balance of the wallet is updated.