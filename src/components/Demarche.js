import { motion } from 'framer-motion'
import React from 'react'


const Demarche = () => {

    const transition = { duration: .3, ease: [0.43, 0.13, 0.23, 0.96] };

    return (
        <motion.div 
        id='demarche'
        initial={{opacity:0}}
        animate={{opacity:1}}
        exit={{opacity:0}}
        transition={transition}
        >
            <h1>Demarche</h1>
            <div id='container'>
                <p>Depuis toujours, je suis fasciné par le corps humain. Pratiquement toute ma production artistique est orientée vers cette thématique. Après mes études collégiales, j’ai pensé devenir illustrateur médical. Je voyais cette avenue comme une façon de conjuguer ma passion de l’art et des sciences. Sauf que je n’avais pas le cœur assez solide. L’idée de manipuler des corps inertes me répugnait!</p>

                <p>De ce fait, j’ai réussi à manier, à ma façon, le corps humain. Je me considère comme un plasticien qui intègre à ses œuvres des personnages hypertexturés représentant la chair, formant ainsi l’expression du corps et exprimant ses émotions, sa sensibilité. Ces personnages sont dans des univers abstraits, parfois femmes, parfois hommes. Je ne ressens pas le besoin de les définir. Il s'agit tout simplement d'êtres humains, de personnes autour desquelles le spectateur peut créer son propre scénario.</p>
                <p>Lorsque je peins, il m’est impossible d’analyser ma méthode de travail. C’est instinctif. Je désire que le public puisse interpréter à sa façon. Je veux lui laisser un « flou » pour qu’il découvre et ressente par lui-même. Je tente de suggérer et non de montrer. Je laisse le spectateur dans un univers de suggestions à travers les formes, les couleurs et les textures. J’apprécie toujours que les gens me disent ce qu’ils voient, ce qu'ils perçoivent. Pour moi, c’est partie intégrante de l’œuvre. Dans ce contexte, je me dois d’être flexible.</p>
                <p>Dans l’ensemble de mes œuvres, le contraste entre le vernis et le mat de la toile fait ressurgir le sujet. Le regardeur devient partie intégrante de l’œuvre par l’effet miroir provoqué par le vernis. Je travaille et manipule le relief pour suggérer que le personnage sort de son environnement pictural. Mon art est intuitif.</p>
            </div>
        </motion.div>
    )
}

export default Demarche
