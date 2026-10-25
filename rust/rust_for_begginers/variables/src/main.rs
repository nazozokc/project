fn main() {
    let mut x:i32 = 5;
    println!("The value of x is : {}", x);
    x =  6;
    println!("The value of x is : {}", x);

    const CONSTANT: usize = 100;
    println!("The value of CONSTANT is: {}", CONSTANT);

    let y: i32 = 5;
    let y: i32 = y +  1;

    {
        let y: i32 = y *  2;
        println!("The value of y is: {}", y);
    }

    println!("The value of y is: {}", y);

}
