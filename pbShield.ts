
//% weight=10 color=#bc0e0b icon="\uf288" block="pbShield"
namespace pbShield{
    
    export enum pos{
        //% blockId="LEFT" block="Left"
        LEFT=0,
        //% blockId="RIGHT" block="Right"
        RIGHT=1
    }
    
    export enum Dir{
        //% blockId="FORWARD" block="Forward"
        FORWARD = 0x0,
        //% blockId="BACKWARD" block="Backward"
        BACKWARD = 0x1
    }
    
    export enum state{
        //% blockId="On" block="On"
        On=0x01,
        //% blockId="Off" block="Off"
        Off=0x00
    }

    export enum ports{
        //% blockId="Port1" block="Port 1"
        Port1 = 0x01,
         //% blockId="Port2" block="Port 2"
        Port2 = 0x02,
          //% blockId="Port3" block="Port 3"
        Port3 = 0x03,
         //% blockId="Port4" block="Port 4"
        Port4=0x04
    }

    export enum PINS{
        //% blockId="PIN1" block="Pin 1"
        PIN1 = 0x01,
         //% blockId="PIN2" block="Pin 2"
        PIN2 = 0x02
    }

    
    //% weight=95
    //% blockId=pb_ReadUltrasonicSensor block="ultrasonic sensor|%port|distance"
    //% port.fieldEditor="gridpicker" direction.fieldOptions.columns=2
    export function ReadUltrasonicSensor(port: ports): number {
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
    export function MotorRun(direction:Dir, speed: number): void {

        pins.digitalWritePin(DigitalPin.P6, direction);
        pins.digitalWritePin(DigitalPin.P8, direction);
        speed *= 4;
        if (direction == Dir.FORWARD)
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
    export function pb_MotorSet(index: pos, speed: number): void {
       
        StopMoving();
        if (index == pos.LEFT)
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
    export function MotorTurn(side: pos): void {
        pins.digitalWritePin(DigitalPin.P6, state.Off);
        pins.digitalWritePin(DigitalPin.P7, state.Off);
        pins.digitalWritePin(DigitalPin.P8, state.On);
        pins.digitalWritePin(DigitalPin.P9, state.On);
        basic.pause(500);
        if (side == pos.LEFT)
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
        pins.digitalWritePin(DigitalPin.P6, state.Off);
        pins.digitalWritePin(DigitalPin.P7, state.Off);
        pins.digitalWritePin(DigitalPin.P8, state.On);
        pins.digitalWritePin(DigitalPin.P9, state.On);
    }
    
    //% weight=20
    //% blockId=pb_ReadButton block="Is On-Board Button Pressed" 
    export function ReadButton():number{
        return pins.digitalReadPin(DigitalPin.P3);
    }
    
    //% weight=20
    //% blockId=pb_SetLED block="Switch on-board LED|%ledswitch"
    //% ledswitch.fieldEditor="gridpicker" ledswitch.fieldOptions.columns=2
    export function SetLED(ledswitch: state): void{
        pins.digitalWritePin(DigitalPin.P13, ledswitch);
    }
