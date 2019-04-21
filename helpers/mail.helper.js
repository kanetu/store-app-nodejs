const fs = require('fs');
const nodemailer = require('nodemailer');
const readline = require('readline');
const {google} = require('googleapis');

//Helper
const stringHelper = require('./string.helper.js');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://mail.google.com'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const CREDENTIAL_FILE = './config/credentials.json';
const TOKEN_PATH = './config/token.json';

// Load client secrets from a local file.
fs.readFile('./config/credentials.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  // Authorize a client with credentials, then call the Gmail API.
  authorize(JSON.parse(content));
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client);
    oAuth2Client.setCredentials(JSON.parse(token));
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
    });
  });
}

var credentials = JSON.parse(fs.readFileSync(CREDENTIAL_FILE))
var tokens = JSON.parse(fs.readFileSync(TOKEN_PATH))

    // create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  service: 'gmail',
  type: "SMTP",
  host: "smtp.gmail.com",
  port: 25,
  secure: true,
  auth: {
    type: 'OAuth2',
    user: 'sufuijk@gmail.com',
    clientId: credentials.installed.client_id.toString(),
    clientSecret: credentials.installed.client_secret.toString(),
    refreshToken: tokens.refresh_token.toString(),
    accessToken: tokens.access_token.toString(),
    expires: tokens.expiry_date,
  },
  tls:{
     rejectUnauthorized: false
   }
})

module.exports.transporter = transporter;

module.exports.getNewGmailToken = (req, res)=>{

  // Load client secrets from a local file.
  fs.readFile('./config/credentials.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials, then call the Gmail API.
    authorize(JSON.parse(content));
  });


}
module.exports.htmlInvoice = (cart, checkoutData, transactionID)=>{



  let cartHTML = "";
  let totalPrice = 0;
  for(let index in cart){
    cartHTML+= "<tr>";
    cartHTML+= `<td>${parseInt(index,10)+1}</td>`;
    cartHTML+= `<td>${cart[index].item.name}</td>`;
    cartHTML+= `<td>${cart[index].qty}</td>`;
    cartHTML+= `<td>${cart[index].classify.color + " - " + cart[index].classify.size}</td>`;
    cartHTML+= `<td>${cart[index].item.price.toLocaleString('it-IT').split(',').join('.')}đ</td>`;
    cartHTML+= `<td>${cart[index].price.toLocaleString('it-IT').split(',').join('.')}đ</td>`;
    cartHTML+="</tr>";
    totalPrice+= cart[index].price;
  }

  let num2Word = stringHelper.num2Word.convert(totalPrice);
  var html = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <style>
      *{
        margin: 0;
        padding: 0;
      }
      body{
        color: #023C76;
      }
      #container{
        min-height: 600px;
        width: 800px;
        margin: 20px auto;
        padding: 10px;
        background: #ECE8E5;
      }
      #header-invoice{
        text-align: center;
        margin-bottom: 15px;
      }
      #title-store{
        font-weight: bold;
        font-size: 1.3em;
        text-transform: uppercase;
        margin-bottom: 5px;
      }
      #caption{
        font-weight: bold;
        font-size: 2em;
        text-transform: uppercase;
        margin: 20px 0;
        text-align: center;
      }
      table{
         margin-top: 10px;
         border-collapse: collapse;
         width: 100%;
         text-align: center;
      }
      table td,
      table th{
        border:1px solid;
      }
      #total-price{
        text-align: right;
        margin: 10px 30px;
      }
      #footer-invoice{
        width: 100%;
        display: flex;
        text-align: center;
        margin-top:80px;
      }
      #customer-sign{
        width: 40%;
      }
      #owner-sign{
        width: 40%;
      }
      #shipper-sign{
        width: 40%;
      }
      #thankful{
        text-align: center;
        font-style: italic;
      }
      #billcode{
        text-align: right;
        margin-right: 10px;
      }
    </style>
  </head>
  <body>
    <div id="container">
      <section >
        <div id="header-invoice">
          <p id="title-store">Cửa hàng quần áo Thời trang Hai lúa</p>
          <p><strong>Địa chỉ:</strong> 145 Nguyễn Thiện Thành, TP Trà Vinh</p>
          <p><strong>Số điện thoại:</strong> 0974648234 - 097597493</p>
        </div>
        <hr>
        <div id="body-invoice">
          <p id="caption">hóa đơn mua hàng</p>
          <p id="billcode">Mã đơn hàng: ${transactionID}</p>
          <p id="customer-name">Tên khách hàng: ${checkoutData.customerFullName}</p>
          <p id="customer-address">Địa chỉ: ${checkoutData.deliveryAddress + " - " + checkoutData.deliveryCity + " - " + checkoutData.deliveryProvince }</p>
          <p id="customer-phone">Số điện thoại: ${checkoutData.customerPhone}</p>
          <table>
            <thead>
              <tr>
                <th>STT</th>
                <th>Tên sản phẩm</th>
                <th>Số lượng</th>
                <th>Màu sắc - Kích thước</th>
                <th>Đơn giá</th>
                <th>Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              ${cartHTML}
            </tbody>
          </table>

          <p id="total-price">TỔNG CỘNG: ${totalPrice.toLocaleString('it-IT').split(',').join('.')}đ</p>
          <p id="total-price">Số tiền viết bằng chữ: ${num2Word} đồng</p>
          <p id="thankful">Cảm ơn bạn đã mua hàng của chúng tôi!</p>
        </div>
        <div id="footer-invoice">
          <div id="customer-sign">
            <strong>Khách hàng</strong> <br>
            (Ký và ghi gõ họ tên)
          </div>
          <div id="shipper-sign">
            <strong>Người giao hàng </strong><br>
            (Ký và ghi gõ họ tên)
          </div>
          <div id="owner-sign">
            <strong>Người lập hóa đơn</strong> <br>
            (Ký và ghi gõ họ tên)
          </div>
        </div>
      </section>
    </div>

  </body>
  </html>
  `;


  return html;
}
