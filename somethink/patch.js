// type obj = {
// 	key: string,
// 	value: string
// }
var oldList = [
	{key: 'a', value: '21'},
	{key: 'f', value: '11'},
	{key: 'd', value: '42'},
	{key: 'v', value: '33'},
	{key: 'w', value: '28'}]

var newList = [
	{key: 'a', value: '20'},
	{key: 'b', value: '11'},
	{key: 'c', value: '42'},
	{key: 'w', value: '28'},
	{key: 'd', value: '33'},
	{key: 'l', value: '11'}]

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
    		oldList.splice( oldEndIdx,0, oldList.splice(oldStartIdx,1)[0])
    		oldStartVnode = oldList[oldStartIdx++]
    		newEndVnode = newList[--newEndIdx]
    		ob(oldList, newList, oldStartIdx, oldEndIdx, newStartIdx, newEndIdx)
    	}else if(sameKey(oldEndVnode, newStartVnode)){
    		patchObj(oldEndVnode, newStartVnode)
    		oldList.splice( oldStartIdx,0, oldList.splice(oldEndIdx,1)[0])
    		oldEndVnode = oldList[--oldEndIdx]
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
}

updateObject(oldList, newList)