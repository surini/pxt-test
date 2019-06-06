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
  
    export class Packeta {
        public mye: string;
        public myparam: number;
    }
    
    export enum aMotors{
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
    
    export enum LED{
        //% blockId="LEDLeft" block="LEDLeft"
        LEDLeft=8,
        //% blockId="LEDRight" block="LEDRight"
        LEDRight=12
    }
    
    export enum LEDswitch{
        //% blockId="turnOn" block="turnOn"
        turnOn=0x01,
        //% blockId="turnOff" block="turnOff"
        turnOff=0x00
    }

    //% advanced=true shim=maqueenIR::initIR
    function initIR(pin: Pins):void{
        return
    }
    //% advanced=true shim=maqueenIR::onPressEvent
    function onPressEvent(btn: RemoteButton,body: Action):void{
        return
    }
    //% advanced=true shim=maqueenIR::getParam
    function getParam():number {
        return 0
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
    export function MotorSet(index: aMotors, speed: number): void {
        let buf = pins.createBuffer(3);
        if (index==0){
            buf[0]=0x00;
        }
        if (index==1){
            buf[0]=0x02;
        }
        
        buf[2]=speed;
        pins.i2cWriteBuffer(0x10, buf);
    }

    //% weight=80
    //% blockId=motor_MotorTurn block="Turn|%side"
    //% side.fieldEditor="gridpicker" side.fieldOptions.columns=2
    export function MotorTurn(side:aMotors): void {
        let buf = pins.createBuffer(3);
        
        buf[0]=0x00;
        buf[1]=side;
        buf[2]=speed;
        pins.i2cWriteBuffer(0x10, buf);
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
    //% blockId=writeLED block="led|%led|ledswitch|%ledswitch"
    //% led.fieldEditor="gridpicker" led.fieldOptions.columns=2 
    //% ledswitch.fieldEditor="gridpicker" ledswitch.fieldOptions.columns=2
    export function writeLED(led:LED, ledswitch:LEDswitch):void{
        if(led==LED.LEDLeft){
            pins.digitalWritePin(DigitalPin.P8, ledswitch)
        }else if(led==LED.LEDRight){
            pins.digitalWritePin(DigitalPin.P12, ledswitch)
        }else{
            return
        } 
    }
    

  
}
