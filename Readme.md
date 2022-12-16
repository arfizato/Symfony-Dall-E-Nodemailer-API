<p align="center" width="100%"  >
    <img src="https://paouzswmtqahihhugxtg.supabase.co/storage/v1/object/public/symfony/ADMIN69/15-12-2022%2011:48:00.png" width="150px" alt="just a skully">
</p>

# Symfony-Dall-E-API

This is the API required for the change Password function in [Symfony-Dall-E](https://github.com/arfizato/Symfony-Dall-E) to function.

I resorted to creating an api because whenever i import `nodemailer` in Symfony-Dall-E webpack wouldn't bundle it correctly and it throws 40 errors 😅

Ofc there might be a better or easier solution. I just used this one.

If you have a way to fix the webpack error go for it and please do a pull request or create an issue explaining how i could fix it myself. 

Any feedback is appreciated.

## Setup
-------------------
first open the directory and run:

```
npm install
```
Then, You'll need to create a `secrets.json` file and place it in the root directory. Check [Nodemailer](https://nodemailer.com) if you don't know how to use your Gmail account with nodemailer
```json
{
    "senderEmail":NODEMAILER_EMAIL,
    "senderPassword":NODEMAILER_PASSWORD,
    "emailPort": PORT,
    "emailHost": "smtp.gmail.com"
}
```
then just run and keep it running while you use the webapp
```shell
node "./sendnodemail.js"
```

## Example
-------------------
A small example of how to send the post request using Fetch
```js
var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

var raw = JSON.stringify({
  "email": RECEPIENT_EMAIL,
  "username": RECEPIENT_USERNAME,
  "url": "http://localhost:8000/newpass"
});

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};

fetch("http://localhost:8080/sendEmail", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));
```

