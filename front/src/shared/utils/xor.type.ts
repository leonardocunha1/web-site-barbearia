export type Nullable<T> = T | null | undefined


// retira as chaves de T que estão em U e adiciona o resto de T como opcional
// Exemplo: Without<{ a: string; b: number }, { b: number }>
// resulta em { a?: never }
// ou seja, só pode ter a chave 'a' e não pode ter a chave 'b'
type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never }
export type XOR<T, U> = T | U extends object
  ? (Without<T, U> & U) | (Without<U, T> & T)
  : T | U

/*
!Exemplo explicando o XOR:
XOR é um tipo que permite que apenas um dos tipos seja definido, mas não ambos ao mesmo tempo.

?Verificação T | U extends object: Se T ou U for um tipo objeto, o tipo condicional entra em ação. Caso contrário, simplesmente retorna T | U (união comum).

*exemplo 1:
type A = { a: string }
type B = { b: number }
type C = XOR<A, B>
C pode ser { a: string } ou { b: number }, mas não ambos ao mesmo tempo.
const example1: C = { a: 'Hello' } // Válido
const example2: C = { b: 42 } // Válido
const example3: C = { a: 'Hello', b: 42 } // Inválido, pois não pode ter ambos os campos ao mesmo tempo
const example4: C = {} // Inválido, pois deve ter pelo menos um campo


*exemplo 2: 
type A = { a: string; common: number }
type B = { b: string; common: number }

type OnlyA = Without<B, A> & A
{ b?: never } & { a: string; common: number }

type OnlyB = Without<A, B> & B
{ a?: never } & { b: string; common: number }

type X = XOR<A, B> 
(OnlyA) | (OnlyB)


!O operador & (interseção) cria um novo tipo que combina todas as propriedades dos tipos envolvidos.
Ou seja, o objeto resultante deve satisfazer todos os tipos ao mesmo tempo.
Exemplo: { a: string; common: number } & { b?: never } resulta em { a: string; common: number, b?: never }

Em typescript | é a união de tipos, ou seja, os campos que estão em pelo menos um dos tipos.
Exemplo: 
type A = { a: string }
type B = { b: number }

type C = A | B
c pode ser:
const x1: C = { a: 'hello' }        // ✅ OK
const x2: C = { b: 42 }             // ✅ OK
const x3: C = { a: 'hi', b: 10 }    // ✅ Também OK (tem as duas propriedades)
*/