/*


class Hotels{
    static find(start,limit){
        ref.startAt(start).limitToFirst(limit).once('value').then(data=>{
            console.log(data.val());
        })
    }

    static count(){

        return new Promise(function(resolve, reject){
            resolve(ref.once('value').then(data=>{
                return data;
            }));
            reject((err)=>{
                    return err;
                }
            )
        });
    }


}


module.exports = Hotels;
*/
