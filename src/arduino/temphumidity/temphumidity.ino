#include <dht.h>
#include <LiquidCrystal_I2C.h>
#include <Wire.h>
#include <stdarg.h>

dht DHT; // temp humidity meter
LiquidCrystal_I2C lcd(0x27, 2,  1, 0, 4, 5, 6, 7); // LCD display

#define DHT11_PIN 7

bool backlightOn = true;

// Thank you, Jan Turoň
// Solution link:
// https://arduino.stackexchange.com/a/72456
void Serialprintln(const char* input...) {
  va_list args;
  va_start(args, input);
  for (const char* i = input; *i != 0; ++i) {
    if (*i!='%') {
      Serial.print(*i);
      continue;
      }
    switch (*(++i)) {
      case '%': Serial.print('%'); break;
      case 's': Serial.print(va_arg(args, char*)); break;
      case 'd': Serial.print(va_arg(args, int), DEC); break;
      case 'b': Serial.print(va_arg(args, int), BIN); break;
      case 'o': Serial.print(va_arg(args, int), OCT); break;
      case 'x': Serial.print(va_arg(args, int), HEX); break;
      case 'f': Serial.print(va_arg(args, double), 2); break;
    }
  }
  Serial.println();
  va_end(args);
}

void setup() {
  Serial.begin(9600);
  lcd.begin(16,2);
  
  lcd.setBacklightPin(3,POSITIVE);
  lcd.setBacklight(HIGH);
  lcd.home();
  
  lcd.print("Temperature and");
  lcd.setCursor(0,1);
  lcd.print("humidity meter");
  
  delay(2000);
  lcd.clear();
  delay(250);
}

void loop() {
  if (Serial.available() > 0) {
    int listener = Serial.read();
    if (listener == '1') {
      if (backlightOn) {
        lcd.setBacklight(LOW);
        backlightOn = false;
      } else {
        lcd.setBacklight(HIGH);
        backlightOn = true;
      }
    }
  }
  int chk = DHT.read11(DHT11_PIN);
  int data[2];
  
  data[0] = (int)DHT.temperature;
  data[1] = (int)DHT.humidity;

  // printing onto LCD screen
  // first line (e.g.): "Temp: 23°C"
  lcd.setCursor(0,0);
  lcd.print("Temp: ");
  lcd.print(data[0]);
  lcd.print((char)223);
  lcd.print("C");
  
  // second line (e.g.): "Humidity: 56%"
  lcd.setCursor(0,1);
  lcd.print("Humidity: ");
  lcd.print(data[1]);
  lcd.print("%");

  // let's make it so
  // it can be JSON parsed
  // to work with data easier
  Serialprintln("{\"temp\": %d, \"humid\": %d}", data[0], data[1]);
  
  // refresh every 2 seconds
  delay(2000);
}
