let maqueencb: Action
let maqueenmycb: Action
let maqueene        = "1"
let maqueenparam    = 0
let alreadyInit=0
let IrPressEvent=0
const MOTER_ADDRESSS = 0x10

enum PingUnit {
//% block="cm"
Centimeters,
//% block="μs"
MicroSeconds
}


//% weight=10 color=#bc0e0b icon="\uf288" block="PalmBot"
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
    
    export enum Patrol{
        //% blockId="PatrolLeft" block="PatrolLeft"
        PatrolLeft=13,
        //% blockId="PatrolRight" block="PatrolRight"
        PatrolRight=14
    }
    
    export enum state{
        //% blockId="On" block="On"
        On=0x01,
        //% blockId="Off" block="Off"
        Off=0x00
    }


    
    function maqueenInit():void{
        if(alreadyInit==1){
            return
        }
        alreadyInit=1
    }
  

    
    //% blockId=ultrasonic_sensor block="sensor unit|%unit"
    //% weight=95
    export function sensor(unit: PingUnit, maxCmDistance = 500): number {
        // send pulse
        pins.setPull(DigitalPin.P1, PinPullMode.PullNone);
        pins.digitalWritePin(DigitalPin.P1, 0);
        control.waitMicros(2);
        pins.digitalWritePin(DigitalPin.P1, 1);
        control.waitMicros(10);
        pins.digitalWritePin(DigitalPin.P1, 0);
        pins.setPull(DigitalPin.P2, PinPullMode.PullUp);
        
        

        // read pulse
        let d = pins.pulseIn(DigitalPin.P2, PulseValue.High, maxCmDistance * 42);
        console.log("Distance: " + d/42);
        
        basic.pause(50)

        switch (unit) {
            case PingUnit.Centimeters: return d / 42;
            default: return d ;
        }
    }
    
    //% weight=90
    //% blockId=motor_MotorRun block="Run|%direction|with power|%speed"
    //% speed.min=0 speed.max=255
    //% direction.fieldEditor="gridpicker" direction.fieldOptions.columns=2
    export function MotorRun(direction:Dir, speed: number): void {
        let buf = pins.createBuffer(3);
        
        buf[0]=0x00;
        buf[1]=direction;
        buf[2]=speed;
        pins.i2cWriteBuffer(0x10, buf);
    }

    
    //% weight=85
    //% blockId=motor_MotorSet block="Set|%index|motor's power|%speed"
    //% speed.min=-255 speed.max=255
    //% index.fieldEditor="gridpicker" index.fieldOptions.columns=2
    export function MotorSet(index: pos, speed: number): void {
        if (index == pos.LEFT)
        {
            if (speed >= 0) {
                pins.digitalWritePin(DigitalPin.P5, state.Off)
                pins.analogWritePin(AnalogPin.P2, speed)
            }
            else
            {
                pins.digitalWritePin(DigitalPin.P5, state.On)
                speed = 255-speed
                pins.analogWritePin(AnalogPin.P2, speed)
            }
            
        }
        else
        {
            if (speed >= 0) {
                pins.digitalWritePin(DigitalPin.P6, state.Off)
                pins.analogWritePin(AnalogPin.P4, 255)
            }
            else
            {
                pins.digitalWritePin(DigitalPin.P6, state.On)
                speed = 255-speed
                pins.analogWritePin(AnalogPin.P4, speed)
            }
            
        }

    }

    //% weight=80
    //% blockId=motor_MotorTurn block="Turn|%side"
    //% side.fieldEditor="gridpicker" side.fieldOptions.columns=2
    export function MotorTurn(side: pos): void {
        pins.digitalWritePin(DigitalPin.P2, state.Off)
        pins.digitalWritePin(DigitalPin.P4, state.Off)
        pins.digitalWritePin(DigitalPin.P5, state.Off)
        pins.digitalWritePin(DigitalPin.P6, state.Off)
    
        if (index == pos.LEFT)
        {
            pins.analogWritePin(AnalogPin.P2, 255)
        }
        else
        {
            pins.analogWritePin(AnalogPin.P4, 255)
        }

        basic.pause(200)
        pins.digitalWritePin(DigitalPin.P2, state.Off)
        pins.digitalWritePin(DigitalPin.P4, state.Off)
    }
    
    //% weight=10
    //% blockId=motor_stopMoving block="Stop Moving"
    export function stopMoving(): void {
        let buf = pins.createBuffer(3);
        buf[0]=0x00;
        buf[1]=0;
        buf[2]=0;
        pins.i2cWriteBuffer(0x10, buf);
        buf[0]=0x02;
        pins.i2cWriteBuffer(0x10, buf);
    }
    
    //% weight=20
    //% blockId=read_Patrol block="Read Patrol|%patrol"
    //% patrol.fieldEditor="gridpicker" patrol.fieldOptions.columns=2 
    export function readPatrol(patrol:Patrol):number{
        if(patrol==Patrol.PatrolLeft){
            return pins.digitalReadPin(DigitalPin.P13)
        }else if(patrol==Patrol.PatrolRight){
            return pins.digitalReadPin(DigitalPin.P14)
        }else{
            return -1
        } 
    }
    
    //% weight=20
    //% blockId=writeLED block="turn on board LED|%ledswitch"
    //% ledswitch.fieldEditor="gridpicker" ledswitch.fieldOptions.columns=2
    export function writeLED(ledswitch: state): void{
        pins.digitalWritePin(DigitalPin.P13, ledswitch) 
    }
    

  
}
