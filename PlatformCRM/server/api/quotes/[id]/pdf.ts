import PDFDocument from 'pdfkit'
import prisma from '~/server/database';

export default defineEventHandler(async(event)=>{
    //recuperer l'id du devis depuis l'url
   
    const devisId = parseInt(event.context.params?.id as string);
    if(!devisId){
        throw createError({statusCode:400, statusMessage:`L'ID du devis est manquant.`})
    }

    //recuperer  les details du devis depuis la bd
    const quoteDetails = await prisma.quote.findUnique({
        where:{id:devisId},
        include:{
            customer:true,
            project:true,
            stages:{
                include:{
                    projectStage:true,
                }
            }
        }
    })
    //verifier si le devis a ete trouve
    if(!quoteDetails){
        throw createError({statusCode:404, statusMessage:'Devis non trouvé'})
    }

    //creer un nouveau pdf avec pdfkit
    const doc =new PDFDocument({margin:50})//definr la marge
    
const fs = require('fs')
   
    doc.pipe(fs.createWriteStream('output.pdf'))

    // ajouter le contenu au pdf
    doc.fontSize(25).text(`Devis #${quoteDetails.number}`, {align:'center'});
    doc.moveDown()// descendre d'une ligne

    //info generale
    doc.fontSize(12).text(`Client: ${quoteDetails.customer?.name || 'N/A'}`);
    doc.text(`Projet: ${quoteDetails.project?.title || 'N/A'}` );
    doc.moveDown()

    //entete du tableau pour les etapes
    const tableTop = doc.y //pour dire position Y
    const itemX = 50 // position X pour le nom des etapes
    const priceX = 400 // position x pour le prix

    doc.font('Helvetica-Bold').fontSize(12);
    doc.text('Étape', itemX, tableTop)
    doc.text('Prix', priceX, tableTop)
    doc.moveDown()

    //contenu du tableau des etapes
     doc.font('Helvetica-Bold').fontSize(10);
     let currentY = doc.y //position Y pour le contenu

     quoteDetails.stages.forEach((stage:any)=>{
        doc.text(stage.projectStage.title, itemX, currentY)
        doc.text(`${stage.prix} FCFA`, priceX, currentY)
        currentY +=20 //espacement entre les lignes

         //gerer les saut de page
         if(doc.y > doc.page.height - doc.page.margins.bottom - 50){
 doc.addPage()
 currentY = doc.y // reinitialise la position Y
     }
     })
     doc.moveDown()
     //Prix total du devis
     doc.fontSize(14).font('Helvetica-Bold').text(`Prix Total: ${quoteDetails.newTotalPrice !==null && quoteDetails.newTotalPrice!==undefined ? quoteDetails.newTotalPrice: quoteDetails.totalPrice} FCFA`,{align:'right'})

     //finaliser le doc pdf
     doc.end()

    
    
})