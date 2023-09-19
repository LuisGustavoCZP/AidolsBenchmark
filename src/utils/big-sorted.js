export class BigSortedList
{
    list;
    patternList;
    length;
    current;

    /**
     * @param {number} length 
     * @param {Array} list 
     */
    constructor (list, length)
    {
        this.patternList = [...list];
        this.length = length;
        this.list = [];
        this.current = 0;
        this.sort ();

        console.log(this.list, this.length)
    }

    sort ()
    {
        this.list = new Array(this.length)
        for (let index = 0; index < this.length; index++)
        {
            const i = index % this.patternList.length;
            if (i === 0) this.patternList.sort((a, b) => Math.floor(Math.random() * 3 ) - 2);
            this.list[index] = this.patternList[i];
        }
    }

    next ()
    {
        return this.list[this.current--];
    }

    iteration (index)
    {
        return this.list[index];
    }
}