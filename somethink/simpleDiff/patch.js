// type obj = {
// 	key: string,
// 	value: string
// }
var oldList = [
	{key: 'a', value: '21'},
	{key: 'f', value: '11'}]

var newList = [
	{key: 'a', value: '20'}]

function createObject(obj){
	console.log('create')
	return Object.assign({},obj)
}
function sameKey(a,b){
	if( a && b){
		return a.key === b.key
	}
	return false
}
function patchObj(oldO, newO){
	oldO.value = newO.value
}
function createKeyToOldIdx(list, beginIdx, endIdx){
	var map = Object.create(null)
	let i, key
	for (i = beginIdx; i <= endIdx; ++i) {
	    key = list[i].key
	    if (map[key] == undefined) map[key] = i
	}
	return map
}
function exchangePos(arr, i1, i2){
	[arr[i1], arr[i2]] = [arr[i2], arr[i1]]
}
function ob(o,n, osi, oei, nsi, noi){
	console.log(osi, oei, nsi, noi)
	console.log(o)
	console.log(n)
	console.log('\n')
}
function updateObject(oldList /*Array<obj>*/, newList /*Array<obj>*/){
	let oldStartIdx = 0
    let newStartIdx = 0
    let oldEndIdx = oldList.length - 1
    let oldStartVnode = oldList[0]
    let oldEndVnode = oldList[oldEndIdx]
    let newEndIdx = newList.length - 1
    let newStartVnode = newList[0]
    let newEndVnode = newList[newEndIdx]
    let oldKeyToIdx, elmToMove
    while(oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx){
    	if(sameKey(oldStartVnode, newStartVnode)){
    		patchObj(oldStartVnode, newStartVnode)
    		oldStartVnode = oldList[++oldStartIdx]
    		newStartVnode = newList[++newStartIdx]
    		ob(oldList, newList, oldStartIdx, oldEndIdx, newStartIdx, newEndIdx)
    	}else if(sameKey(oldEndVnode, newEndVnode)){
    		patchObj(oldEndVnode, newEndVnode)
    		oldEndVnode = oldList[--oldEndIdx]
    		newEndVnode = newList[--newEndIdx]
    		ob(oldList, newList, oldStartIdx, oldEndIdx, newStartIdx, newEndIdx)
    	}else if(sameKey(oldStartVnode, newEndVnode)){
    		patchObj(oldStartVnode, newEndVnode)
    		exchangePos(oldList, oldEndIdx, oldStartIdx)
    		oldEndVnode = oldList[--oldEndIdx]
    		newEndVnode = newList[--newEndIdx]
    		ob(oldList, newList, oldStartIdx, oldEndIdx, newStartIdx, newEndIdx)
    	}else if(sameKey(oldEndVnode, newStartVnode)){
    		patchObj(oldEndVnode, newStartVnode)
    		exchangePos(oldList, oldEndIdx, oldStartIdx)
    		oldStartVnode = oldList[++oldStartIdx]
    		newStartVnode = newList[++newStartIdx]
    		ob(oldList, newList, oldStartIdx, oldEndIdx, newStartIdx, newEndIdx)
    	}else{
    		if(oldKeyToIdx === undefined){
    			oldKeyToIdx = createKeyToOldIdx(oldList, oldStartIdx, oldEndIdx)
    		}
    		idxInOld = newStartVnode.key ? oldKeyToIdx[newStartVnode.key] : null
    		if(idxInOld == null){
    			elmToMove = createObject(newStartVnode)
    			oldList.splice(oldStartIdx,0,elmToMove)
    			oldEndVnode = oldList[++oldEndIdx]
    		}else{
    			elmToMove = oldList[idxInOld]
    			patchObj(elmToMove, newStartVnode)
				oldList.splice(idxInOld,1)
    			oldList.splice(oldStartIdx,0,elmToMove)
    		}
			oldStartVnode = oldList[++oldStartIdx]
			newStartVnode = newList[++newStartIdx]
			ob(oldList, newList, oldStartIdx, oldEndIdx, newStartIdx, newEndIdx)
    	}
    }
    if(oldStartIdx > oldEndIdx){
    	// oldList多余部分舍弃
    	oldList = oldList.concat(newList.slice(oldStartIdx))
    }else if(newStartIdx > newEndIdx){
    	// oldList少于部分补充
    	oldList = oldList.slice(0,newStartIdx)
    }
    console.log('end', oldList)
}

updateObject(oldList, newList)