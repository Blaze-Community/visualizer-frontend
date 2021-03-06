import Visualizers from './visualizers';
import { inject as service } from '@ember/service';


export default Visualizers.extend( {

    pathForType(){
        return "signup";
    }
});
