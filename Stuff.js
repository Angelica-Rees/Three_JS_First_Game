// const spotLight = new THREE.SpotLight(0xffffff);
// spotLight.position.set(100, 1000,100 ).normalize();
// spotLight.castShadow = true
// scene.add(spotLight);

class ThirdPersonCamera{
    constructor(params){
      this.params = params
      this.camera = params.camera
      
      this.currentPosition = new THREE.Vector3()
      this.currentLookAt = new THREE.Vector3()
    }
  
    MakeIdealLookAt(){
      const idealLookAt = new THREE.Vector3()
      idealLookAt.applyQuaternion(this.params.target.Rotation)
      idealLookAt.add(this.params.target.Position)
      return idealLookAt;
    }
  
    MakeIdealOffset(){
      const idealOffset = new THREE.Vector3()
      idealOffset.applyQuaternion(this.params.target.Rotation)
      idealOffset.add(this.params.target.Position)
      return idealOffset;
    }
  
    update(){
      const idealOffset = this.MakeIdealOffset()
      const idealLookAt = this.MakeIdealLookAt()
  
      this.currentPosition.copy(idealOffset)
      this.currentLookAt.copy(idealLookAt)
  
      this.camera.position.copy(this.currentPosition)
      this.camera.lookAt(this.currentLookAt)
    }
  }


const ThirdPersonCameracamera =  new ThirdPersonCamera({
    camera: this.camera
  })