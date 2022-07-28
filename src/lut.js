import { LUTPass } from '../examples/jsm/postprocessing/LUTPass.js';
import { LUTCubeLoader } from '../examples/jsm/loaders/LUTCubeLoader.js';
import { LUT3dlLoader } from '../examples/jsm/loaders/LUT3dlLoader.js';


class Lut {
    params = {
        enabled: true,
        // lut: 'Bourbon 64.CUBE',
        lut: 'Cubicle 99.CUBE',
        intensity: 1,
        use2DLut: false,
    };

    lutMap = {
        'Bourbon 64.CUBE': null,
        'Chemical 168.CUBE': null,
        'Clayton 33.CUBE': null,
        'Cubicle 99.CUBE': null,
        'Remy 24.CUBE': null,
        'Presetpro-Cinematic.3dl': null
    };

    test = 'aaa'

    lutPass = new LUTPass();

    lutLoad() {
        // console.log('lutLoad', this.lutMap, this.params)
        const lutMap = this.lutMap
        Object.keys(lutMap).forEach(name => {

            if (/\.CUBE$/i.test(name)) {

                new LUTCubeLoader()
                    .load('../examples/luts/' + name, function(result) {

                        lutMap[name] = result;

                    });

            } else {

                new LUT3dlLoader()
                    .load('../examples/luts/' + name, function(result) {

                        lutMap[name] = result;

                    });

            }
        });

        this.lutMap = lutMap
    }


    render() {
        this.lutPass.enabled = this.params.enabled && Boolean(this.lutMap[this.params.lut]);
        this.lutPass.intensity = this.params.intensity;
        if (this.lutMap[this.params.lut]) {

            const lut = this.lutMap[this.params.lut];
            this.lutPass.lut = this.params.use2DLut ? lut.texture : lut.texture3D;

        }
    }


}

export { Lut };


// class Car {
//     constructor(name, year) {
//         this.name = name;
//         this.year = year;
//     }
//     age(x) {
//         return x - this.year;
//     }
// }

// let date = new Date();
// let year = date.getFullYear();

// let myCar = new Car("Ford", 2014);
// document.getElementById("demo").innerHTML =
//     "My car is " + myCar.age(year) + " years old.";