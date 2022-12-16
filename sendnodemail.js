const nodemailer = require("nodemailer");
const {createClient}= require("@supabase/supabase-js");
var cors = require('cors')
const express = require("express");
const app = express();
const PORT = 8080;
const sep="\n|*-------------------------------------------------------------------------*|\n";
// console.log(`\x1b[36m`,"wpw","yay",`\x1b[0m`);  //cyan

app.use(express.json());
app.use(cors({origin: '*'}));
app.listen(
    PORT,
    ()=> console.log(`\x1b[32m%s\x1b[0m`,`${sep}|*\t\t\t   http://localhost:${PORT}\t\t\t   *|${sep}`)
);
/* -------------------------------------------------------------------------- */
/*                       SENDING EMAIL TO RESET PASSWORD                      */
/* -------------------------------------------------------------------------- */
app.post("/sendEmail", (req,res) => {
    const uuid = generateUUID();
    addToken(req,uuid);
    sendMail(req,res,uuid);
});

async function addToken(req,uuid){    
    const supabaseUrl = 'https://paouzswmtqahihhugxtg.supabase.co';
    const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBhb3V6c3dtdHFhaGloaHVneHRnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY2OTYzNzk5NiwiZXhwIjoxOTg1MjEzOTk2fQ.Quym-dQcWBtCYeAjtV7kAkY79w3pYGDeCVLGJ4MbYw0";
    const supabase = createClient(supabaseUrl, supabaseKey);

    const {email}= req.body;
    const tokenExpirationDate=new Date(+new Date()+60*60*24*1000);
    
    const { data, error } = await supabase
        .from('User')
        .update({ authToken: uuid, tokenExpirationDate: tokenExpirationDate})
        .eq('email', email);
    console.log((new Date()).toLocaleString(),"updateTable:",data,error);
}
function sendMail(req,res,uuid){
    // const {id}= req.params;
    const {email,username,url}= req.body;
    if (!email || !username || !url ){
        res.status(418).send({message:`body params missing. . . `});
    }
    
    const {senderEmail,senderPassword,emailPort,emailHost}=  require("./secrets.json")
    const msg = {
        from: senderEmail,
        to:email,
        subject:`${ uuid.split("-")[1]}: Forgot Password?`,
        html:`            
            <body style="margin: 0;padding:2rem; background-color: #BFDBFE; font-family:'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif   ;">
                <div class="container" style="margin: 2rem auto; width: fit-content; background-color: #fff; border-radius: 0.5rem; padding: 1.5rem .5rem;width: 38rem;" >
                    <a href="arfizato.tn" style="width: 100%; display: flex; align-items: center;">
                        <img src="https://paouzswmtqahihhugxtg.supabase.co/storage/v1/object/public/symfony/ADMIN69/15-12-2022%2011:48:00.png" alt="hey" style="border-radius: 0.25rem; width: 13rem; margin:auto;"/>
                    </a>
                    <p style="text-align: center; width: 38rem;" >${username}</p>
                    <p style="text-align: center; width: 38rem;" >If you requested to change your password click the button below.<br> Otherwise, you don't need to worry.</p>
                    <div style="width: 100%; text-align: center;">
                        <a href=${url+"?authToken="+uuid} target="_blank" style="background-color: #3B82F6; color: #fff; text-decoration: none; padding: .5rem 2.5rem; border-radius: 0.25rem; transition: all .5s; margin:auto;" >Click Me!</a>
                    </div>
                </div>
            </body>
        `,
    };  
    nodemailer.createTransport({
        service:  'gmail',
        auth: {
            user: senderEmail,
            pass: senderPassword
        },
        port: emailPort,
        host: emailHost
    })
    .sendMail(msg, (err )=>{
        if(err) {
            return console.log('Error occurs!', err);
        }else{
            res.send({success: true,Recepient: username +" <"+email+">" })
            return console.log(`Email sent to ${email}`);
        }
    })

    
}
function generateUUID() { // Public Domain/MIT 1d82717f-11c1-43c2-b405-e91055210c43
    var d = new Date().getTime();//Timestamp
    var d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now()*1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16;//random number between 0 and 16
        if(d > 0){//Use timestamp until depleted
            r = (d + r)%16 | 0;
            d = Math.floor(d/16);
        } else {//Use microseconds since page-load if supported
            r = (d2 + r)%16 | 0;
            d2 = Math.floor(d2/16);
        }
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}
