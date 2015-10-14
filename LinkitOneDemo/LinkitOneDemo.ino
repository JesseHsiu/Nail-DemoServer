#include<LWiFi.h>
#include<LWiFiClient.h>
#include<HttpClient.h>

#define WIFI_NAME "Lab430PrinterWifi" // 填入WiFi AP網路名稱SSID
#define WIFI_PASSWD "androidiphone" // 填入密碼
#define URL "10.4.28.5"
LWiFiClient c; // 客戶端
String data = "";

void setup()
{
//  Serial.begin(38400);
  
  LWiFi.begin(); // 初始化WiFi模組

  if(LWiFi.connectWPA(WIFI_NAME, WIFI_PASSWD) > 0){
//    Serial.println("Connect ok");
  }
  else{
//    Serial.println("Connect fail");
  }
  Serial1.begin(38400);

}

void loop()
{
   char inchar;

   while( inchar != '\n'){
     if (Serial1.available()) {
       inchar = Serial1.read();
     }
   }

   inchar = '0';
   
   while( inchar != '\n'){
     if (Serial1.available()) {
       inchar = Serial1.read();
//       Serial.print(inchar);
       data = data + inchar;
     }
   }

   //Serial.println(data);
   
    while(!c.connect(URL,3000)){
//     Serial.println("Retrying to connect...");
      delay(100);  
    }

    String thisLength = String(data.length());
    // Build HTTP POST request
    c.println("POST / HTTP/1.1");
    c.println("Content-Type: application/json");
    c.println("Content-Length: " + thisLength);
    inchar = '0';
     while( inchar != '\n'){
     if (Serial1.available()) {
       inchar = Serial1.read();
     }
   }
    c.print("Host: ");
    c.println(data);

   
//    delay(100);
    
    data = "";
   


}
