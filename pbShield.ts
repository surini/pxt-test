
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

    
    //% blockId=ultrasonic_sensor block="ultrasonic sensor distance"
    //% weight=95
    export function sensor(): number {
        // send pulse
        pins.setPull(DigitalPin.P1, PinPullMode.PullNone)
        pins.digitalWritePin(DigitalPin.P9, 0)
        control.waitMicros(2)
        pins.digitalWritePin(DigitalPin.P9, 1)
        control.waitMicros(10)
        pins.digitalWritePin(DigitalPin.P9, 0)
        pins.setPull(DigitalPin.P10, PinPullMode.PullUp)
        
        

        // read pulse
        return pins.pulseIn(DigitalPin.P10, PulseValue.High, 21000) / 42
    }
    
    //% weight=90
    //% blockId=motor_MotorRun block="Run|%direction|with power|%speed"
    //% speed.min=0 speed.max=255
    //% direction.fieldEditor="gridpicker" direction.fieldOptions.columns=2
    export function MotorRun(direction:Dir, speed: number): void {

        pins.digitalWritePin(DigitalPin.P6, direction)
        pins.digitalWritePin(DigitalPin.P8, direction)
        speed *= 4
        if (direction == Dir.FORWARD)
        {
            pins.analogWritePin(AnalogPin.P6, 1023)
            pins.analogWritePin(AnalogPin.P9, 1023)
            speed = 1023-speed
            pins.analogWritePin(AnalogPin.P7, speed)
            pins.analogWritePin(AnalogPin.P8, speed)
        }
        else
        {
            pins.analogWritePin(AnalogPin.P7, 1023)
            pins.analogWritePin(AnalogPin.P8, 1023)
            speed = 1023-speed
            pins.analogWritePin(AnalogPin.P6, speed)
            pins.analogWritePin(AnalogPin.P9, speed)
        }
    }

    
    //% weight=85
    //% blockId=motor_MotorSet block="Set|%index|motor's power|%speed"
    //% speed.min=-255 speed.max=255
    //% index.fieldEditor="gridpicker" index.fieldOptions.columns=2
    export function MotorSet(index: pos, speed: number): void {
       
        stopMoving()
        if (index == pos.LEFT)
        {
            if (speed >= 0) {
                pins.analogWritePin(AnalogPin.P6, 1023)
                speed *= 4;
                speed = 1023-speed;
                pins.analogWritePin(AnalogPin.P7, speed)
            }
            else
            {
                pins.analogWritePin(AnalogPin.P7, 1023)
                speed *= 4;
                speed = 1023-speed;
                pins.analogWritePin(AnalogPin.P6, speed)
            }
            
        }
        else
        {
            if (speed >= 0) {
                pins.analogWritePin(AnalogPin.P9, 1023)
                speed *= 4;
                speed = 1023-speed;
                pins.analogWritePin(AnalogPin.P8, speed)
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
    //% blockId=motor_MotorTurn block="Turn|%side"
    //% side.fieldEditor="gridpicker" side.fieldOptions.columns=2
    export function MotorTurn(side: pos): void {
        pins.digitalWritePin(DigitalPin.P6, state.Off)
        pins.digitalWritePin(DigitalPin.P7, state.Off)
        pins.digitalWritePin(DigitalPin.P8, state.On)
        pins.digitalWritePin(DigitalPin.P9, state.On)
    
        if (side == pos.LEFT)
        {
            pins.analogWritePin(AnalogPin.P6, 1024)
            pins.analogWritePin(AnalogPin.P7, 1)
        }
        else
        {
            pins.analogWritePin(AnalogPin.P9, 1024)
            pins.analogWritePin(AnalogPin.P8, 1)
        }

        basic.pause(200)
        stopMoving()
    }
    
    //% weight=10
    //% blockId=motor_stopMoving block="Stop Moving"
    export function stopMoving(): void {
        pins.digitalWritePin(DigitalPin.P6, state.Off) 
        pins.digitalWritePin(DigitalPin.P7, state.Off) 
        pins.digitalWritePin(DigitalPin.P8, state.On) 
        pins.digitalWritePin(DigitalPin.P9, state.On) 
    }
    
    //% weight=20
    //% blockId=readButton block="On Board Button" 
    export function readButton():number{
        return pins.digitalReadPin(DigitalPin.P3)
    }
    
    //% weight=20
    //% blockId=setLED block="Switch on board LED|%ledswitch"
    //% ledswitch.fieldEditor="gridpicker" ledswitch.fieldOptions.columns=2
    export function setLED(ledswitch: state): void{
        pins.digitalWritePin(DigitalPin.P13, ledswitch) 
    }
    
  
}
