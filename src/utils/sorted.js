export class SortedList
{
    list;
    current;

    /**
     * 
     * @param {Array} list 
     */
    constructor (list)
    {
        this.list = [...list];
        this.sort();
    }

    sort ()
    {
        this.list.sort((a, b) => Math.floor(Math.random()*3)-2);
        this.current = this.list.length-1;
    }

    next ()
    {
        const value = this.list[this.current--];

        if(this.current == 0)
        {
            this.sort ();
        }

        return value;
    }
}