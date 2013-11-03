//sender's nick name validator
if (!(this.sender && this.sender.length > 1 && this.sender.length < 50)) {
    error('sender', "Nimimerkin täytyy olla 2-50 kirjainta pitkä.");
}

//message validator
if (!this.message || this.message.length < 1) {
    error('message', "Viesti ei voi olla tyhjä.");    
} else if (this.message.length > 1000) {
    error('message', "Viesti ei voi olla yli 1000 merkkiä.");
}

//location validator
//lat [-90,90]
//lng [-180,180]
if (!this.location){
    error('location', "Virheellinen sijainti.");
} else {
    try{
        if( this.location[0] < -90 || this.location[0] > 90 || 
        this.location[1] < -180 || this.location[1] > 180  ) {
            error('location', "Virheellinen sijainti.");
        }
        
    }
    catch(err){
        error('location', "Virheellinen sijainti.");
    }
}

emit('messages:create', this);