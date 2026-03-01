interface IProduct {
    name?: string,
    quantity: number,
    price: number
};

export const calcTotalPay = (products: IProduct[]): number => {

    let total = 0;

    products.forEach(p => {
        total += p.price * p.quantity;
    })

    return total;

}