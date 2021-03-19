const express = require('express');
const keys = require('./config/keys')
const stripe = require('stripe')(keys.stripeSecretKey)
const bodyParser = require('body-parser')
const exphbs = require('express-handlebars') //template engine

const app = express()

//middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))

//set static folder
app.use(express.static(`${__dirname}/public`))


app.get('/', (req, res)=>{
    res.render('index', {
        stripePublishableKey: keys.stripePublishableKey
    });
})

app.post('/charge', (req, res)=>{
    const amount = 2500;
    //req: stripe token- reference to card, stripe token type, email
    //adds and chaarges the customer
    stripe.customers.create({
        email: req.body.stripeEmail,
        source: req.body.stripeToken
    })
    .then(customer => stripe.charges.create({
        amount,
        description:'milk and honey by rupi kaur',
        currency:'inr',
        customer: customer.id
    }))
    .then(charge => res.render('success'))


})

const port = process.env.PORT || 3000

app.listen(port, ()=>{
    console.log(`server started on port ${port}`)
})

