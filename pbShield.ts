
//% weight=10 color=#bc0e0b icon="\uf288" block="pbShield"
namespace pbShield{
    
    export enum pbPOSTION{
        //% blockId="LEFT" block="Left"
        LEFT=0,
        //% blockId="RIGHT" block="Right"
        RIGHT=1
    }
    
    export enum pbDIRECTION{
        //% blockId="FORWARD" block="Forward"
        FORWARD = 0x0,
        //% blockId="BACKWARD" block="Backward"
        BACKWARD = 0x1
    }
    
    export enum pbSTATE{
        //% blockId="ON" block="On"
        ON=0x01,
        //% blockId="OFF" block="Off"
        OFF=0x00
    }

    export enum pbPORTS{
        //% blockId="PORT1" block="Port 1"
        PORT1 = 0x01,
         //% blockId="PORT2" block="Port 2"
        PORT2 = 0x02,
          //% blockId="PORT3" block="Port 3"
        PORT3 = 0x03,
         //% blockId="PORT4" block="Port 4"
        PORT4=0x04
    }

    export enum pbPINS{
        //% blockId="PIN1" block="Pin 1"
        PIN1 = 0x01,
         //% blockId="PIN2" block="Pin 2"
        PIN2 = 0x02
    }

    
    //% weight=95
    //% blockId=pb_ReadUltrasonicSensor block="ultrasonic sensor|%port|distance"
    //% port.fieldEditor="gridpicker" direction.fieldOptions.columns=2
    export function ReadUltrasonicSensor(port: pbPORTS): number {
        let pin1 = DigitalPin.P15
        let pin2 = DigitalPin.P16
       
        // send pulse
        pins.setPull(pin2, PinPullMode.PullNone);
        pins.digitalWritePin(pin1, 0);
        control.waitMicros(2);
        pins.digitalWritePin(pin1, 1);
        control.waitMicros(10);
        pins.digitalWritePin(pin1, 0);
        pins.setPull(pin2, PinPullMode.PullUp);
        

        // read pulse
        let value = pins.pulseIn(pin2, PulseValue.High, 21000) / 42;
        console.log("Distance: " + value);
        
        return value;
    }
    
    //% weight=90
    //% blockId=motor_MotorRun block="Run|%direction|with power|%speed"
    //% speed.min=0 speed.max=255
    //% direction.fieldEditor="gridpicker" direction.fieldOptions.columns=2
    export function MotorRun(direction:pbDIRECTION, speed: number): void {

        pins.digitalWritePin(DigitalPin.P6, direction);
        pins.digitalWritePin(DigitalPin.P8, direction);
        speed *= 4;
        if (direction == pbDIRECTION.FORWARD)
        {
            pins.analogWritePin(AnalogPin.P6, 1023);
            pins.analogWritePin(AnalogPin.P9, 1023);
            speed = 1023 - speed;
            pins.analogWritePin(AnalogPin.P7, speed);
            pins.analogWritePin(AnalogPin.P8, speed);
        }
        else
        {
            pins.analogWritePin(AnalogPin.P7, 1023);
            pins.analogWritePin(AnalogPin.P8, 1023);
            speed = 1023 - speed;
            pins.analogWritePin(AnalogPin.P6, speed);
            pins.analogWritePin(AnalogPin.P9, speed);
        }
    }

    
    //% weight=85
    //% blockId=pb_MotorSet block="Set|%index|motor's power|%speed"
    //% speed.min=-255 speed.max=255
    //% index.fieldEditor="gridpicker" index.fieldOptions.columns=2
    export function pb_MotorSet(index: pbPOSTION, speed: number): void {
       
        StopMoving();
        if (index == pbPOSTION.LEFT)
        {
            if (speed >= 0) {
                pins.analogWritePin(AnalogPin.P6, 1023);
                speed *= 4;
                speed = 1023-speed;
                pins.analogWritePin(AnalogPin.P7, speed);
            }
            else
            {
                pins.analogWritePin(AnalogPin.P7, 1023);
                speed *= 4;
                speed = 1023-speed;
                pins.analogWritePin(AnalogPin.P6, speed);
            }
            
        }
        else
        {
            if (speed >= 0) {
                pins.analogWritePin(AnalogPin.P9, 1023);
                speed *= 4;
                speed = 1023-speed;
                pins.analogWritePin(AnalogPin.P8, speed);
            }
            else
            {
                pins.analogWritePin(AnalogPin.P8, 1023)
                speed *= 4;
                speed = 1023-speed;
                pins.analogWritePin(AnalogPin.P9, speed)
            }
            
        }

        
    }

    //% weight=80
    //% blockId=pb_MotorTurn block="Turn|%side"
    //% side.fieldEditor="gridpicker" side.fieldOptions.columns=2
    export function MotorTurn(side: pbPOSTION): void {
        pins.digitalWritePin(DigitalPin.P6, pbSTATE.OFF);
        pins.digitalWritePin(DigitalPin.P7, pbSTATE.OFF);
        pins.digitalWritePin(DigitalPin.P8, pbSTATE.ON);
        pins.digitalWritePin(DigitalPin.P9, pbSTATE.ON);
        basic.pause(500);
        if (side == pbPOSTION.LEFT)
        {
            pins.analogWritePin(AnalogPin.P6, 1024);
            pins.analogWritePin(AnalogPin.P7, 1);
        }
        else
        {
            pins.analogWritePin(AnalogPin.P9, 1024);
            pins.analogWritePin(AnalogPin.P8, 1);
        }

        basic.pause(1000);
        StopMoving();
    }
    
    //% weight=10
    //% blockId=pb_StopMoving block="Stop Moving"
    export function StopMoving(): void {
        pins.digitalWritePin(DigitalPin.P6, pbSTATE.OFF);
        pins.digitalWritePin(DigitalPin.P7, pbSTATE.OFF);
        pins.digitalWritePin(DigitalPin.P8, pbSTATE.ON);
        pins.digitalWritePin(DigitalPin.P9, pbSTATE.ON);
    }
    
    //% weight=20
    //% blockId=pb_ReadButton block="Is On-Board Button Pressed" 
    export function ReadButton():number{
        return pins.digitalReadPin(DigitalPin.P3);
    }
    
    //% weight=20
    //% blockId=pb_SetLED block="Switch on-board LED|%ledswitch"
    //% ledswitch.fieldEditor="gridpicker" ledswitch.fieldOptions.columns=2
    export function SetLED(ledswitch: pbSTATE): void{
        pins.digitalWritePin(DigitalPin.P13, ledswitch);
    }

    //% weight=20
    //% blockId=pb_ReadLight block="On-Board Light Level" 
    export function ReadLight():number{
        return pins.analogReadPin(AnalogPin.P3);
    }


    //% weight=20
    //% blockId=pb_GetPin block="%port|%pin" 
    //% port.fieldEditor="gridpicker" direction.fieldOptions.columns=2
    //% pin.fieldEditor="gridpicker" direction.fieldOptions.columns=2
    export function GetPin(port: pbPORTS, pin: pbPINS): number {
        
        let pin1 = 0;
        let pin2 = 0;
        switch (port) {
            
            case pbPORTS.PORT2:
                {
                    pin1 = DigitalPin.P15;
                    pin2 = DigitalPin.P16;
                    break;
                }
            
            case pbPORTS.PORT3:
                {
                    pin1 = DigitalPin.P0;
                    pin2 = DigitalPin.P1;
                    break;
                }
        
            case pbPORTS.PORT4:
                {
                    pin1 = DigitalPin.P2;
                    pin2 = DigitalPin.P4;
                    break;
                }

            default:
            case pbPORTS.PORT1:
                {
                    pin1 = DigitalPin.P10;
                    pin2 = DigitalPin.P14;
                    break;
                }
        }

        if (pin == pbPINS.PIN1)
        {
            return pin1;
        }
        else
        {
            return pin2;
        }
    }

    //% weight=20
    //% blockId=pb_SetServo block="Set Servo|%port|%pin|angle||%angle"
    //% angle.min=0 speed.max=255
    //% port.fieldEditor="gridpicker" direction.fieldOptions.columns=2
    //% pin.fieldEditor="gridpicker" direction.fieldOptions.columns=2
    export function SetServo(port: pbPORTS, pin: pbPINS, angle: number): void{
        pins.servoWritePin(GetPin(port,pin), angle);
    }
    
  
}
