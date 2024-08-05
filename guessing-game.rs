use std::cmp::Ordering;
use std::io;
use std::io::Write;
use rand::Rng;


fn get_secret(min: i32, max: i32) -> i32 {
    return rand::thread_rng().gen_range(min..=max);
}

fn handle_guess(secret: i32, guesses: i32) {
    print!("Input your number:\t");
    io::stdout().flush().expect("Error flushing");
    let mut guess = String::new();

    io::stdin()
        .read_line(&mut guess)
        .expect("Failed to read line");

    {
        let guess: i32 = guess.trim().parse().unwrap();

        if (guess == secret) {
            println!("You guessed correctly in {} tries.", guesses)
        } else {
            println!("\nIncorrect Guess. You need a {} number", match guess.cmp(&secret) {
                Ordering::Less => "larger",
                Ordering::Greater => "smaller",
                Ordering::Equal => ""
            });
            handle_guess(secret, guesses + 1)
        }
    }
}

fn main() {
    let max = 10;
    let min = 1;
    let secret = get_secret(min, max);

    println!("Guess a number between {} and {}", min, max);

    handle_guess(secret, 1)
}