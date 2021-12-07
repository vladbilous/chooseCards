const app = new Vue({
    el: '#app',
    data: {
        cards: [],
        memoryCards: [],
        flippedCards: [],
        cardsWithWords: [],
        finish: false,
        start: false,
        turns: 0,
        totalTime: {
            minutes: 0,
            seconds: 0,
        },
        currentPage: 1,
        nextDisabled: false,
        prevDisabled: false
    },
    created(){
        this.reset()
    },
    methods: {
        flipCard(card){
            if(card.isMatched || card.isFlipped || this.flippedCards.length === 2)
                return;

            if(!this.start){
                this._startGame();
            }
            if(card.isMatched || card.isFlipped || this.flippedCards.length === 2)
                return;

            card.isFlipped = true;

            if(this.flippedCards.length < 2)
                this.flippedCards.push(card);
            if(this.flippedCards.length === 2)
                this._match(card);
        },
        _match(card){
            this.turns++;
            if(this.flippedCards[0].name === this.flippedCards[1].name){
                setTimeout(() => {
                    this.flippedCards.forEach(card => card.isMatched = true);
                    this.flippedCards = [];

                    //All cards matched ?
                    if(this.memoryCards.every(card => card.isMatched === true)){
                        clearInterval(this.interval);
                        this.finish = true;
                    }

                }, 400);
            }
            else{
                setTimeout(() => {
                    this.flippedCards.forEach((card) => {card.isFlipped = false});
                    this.flippedCards = [];
                }, 800);
            }
        },
        _startGame(){
            this._tick();
            this.interval = setInterval(this._tick,1000);
            this.start = true;
        },

        _tick(){
            if(this.totalTime.seconds !== 59){
                this.totalTime.seconds++;
                return
            }
            this.totalTime.minutes++;
            this.totalTime.seconds = 0;
        },
        reset(){
            clearInterval(this.interval);
            this.cardsWithWords = _.cloneDeep(this.cards)
            this.cardsWithWords.forEach((card) => {
                card.isWord = true
                // Vue.set(card, 'isWord',true);
            });
            this.cards.forEach((card) => {
                Vue.set(card, 'isFlipped',false);
                Vue.set(card, 'isMatched',false);
            });

            setTimeout(() => {
                this.memoryCards = [];
                this.memoryCards = _.shuffle(this.memoryCards.concat(_.cloneDeep(this.cards), _.cloneDeep(this.cardsWithWords)));
                this.totalTime.minutes = 0;
                this.totalTime.seconds = 0;
                this.start = false;
                this.finish = false;
                this.turns = 0;
                this.flippedCards = [];
            }, 600);
        },
        nextPage(){
            if(this.currentPage !== cards.length){
                this.prevDisabled = false
                this.currentPage = this.currentPage+1
                this.cards = cards[this.currentPage-1]
                this.reset()
            }else{
                this.nextDisabled = true
            }

        },
        previousPage(){
            if(this.currentPage !== 1){
                this.nextDisabled = false
                this.currentPage = this.currentPage-1
                this.cards = cards[this.currentPage-1]
                this.reset()
            }else{
                this.prevDisabled = true
            }
        }
    },
    computed:{
        sec(){
            if(this.totalTime.seconds < 10){
                return '0'+this.totalTime.seconds;
            }
            return this.totalTime.seconds;
        },
        min(){
            if(this.totalTime.minutes < 10){
                return '0'+this.totalTime.minutes;
            }
            return this.totalTime.minutes;
        },
    },
    beforeMount(){
        this.cards = cards[0]
        this.reset()
    }
})