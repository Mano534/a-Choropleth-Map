let value,
    countryValue , 
    educationValue , 
    countryUrl = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json',
    EducationUrl = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json';

let AllInFunction = ()=>{

    let h = 700;
    let w = 950;
  let padding = 40;






  let svg =  d3.select('.main')
    .attr("width",w)
    .attr("height",h)
    .style('background-color','#fff')


  

    let colorScale = d3.scaleLinear()
    .domain([d3.min(educationValue,d=>d.bachelorsOrHigher),d3.max(educationValue,d=>d.bachelorsOrHigher)])
    .range(['#fff',"#00ff11"])

    let defferColor = [10,20,30,40,50,60,70,80,90]
    let scaleAxisColor = d3.scaleLinear()
    .domain([0,100])
    .range(['#fff',"#00ff11"])



    let xScaleAxis = d3.scaleLinear()
    .domain([100,0])
    .range([(w/2)+(padding*2),padding*2])

    let xAxis = svg.append('g')
    .attr('id','x-axis')
    .attr('transform',`translate(${(w/2-padding*4)},30)`)
    .call(d3.axisBottom(xScaleAxis))


    let rect = svg.append('g')
    .attr('transform',`translate(${(w/2)-(padding*2)},0)`)
    .attr('id','legend')
    .selectAll('rect')
    .data(defferColor)
    .enter()
    .append('rect')
    .attr('fill',d=>scaleAxisColor(d))
    .attr('width',(w/2)/defferColor.length)
    .attr('height',30)
    .attr('x',(d,i)=>((w/2)/defferColor.length)*i)
    .attr('y',0)
      let coune = 0
    console.log(countryValue.length)

    let countries = svg.selectAll('path.county')
      .data(countryValue)
      .enter()
      .append('path')
      .attr('class','county')
      .attr('d', d3.geoPath())
      .attr('fill', d=>{ 
        let id = d.id;
        let edNeeded = educationValue.find(ele => {return ele.fips === id})
        let persentage = edNeeded.bachelorsOrHigher;
        let color = colorScale(persentage);
        // return color
        return color;
      })
      .attr('transform',`translate(0,30)`)
      .attr('data-education',d=>{
        let id = d.id;
        let edNeeded = educationValue.find(ele => {return ele.fips === id})
        return edNeeded.bachelorsOrHigher
      })
      .attr("data-fips",d=>{
        let id = d.id;
        return id
      })
      .on('mouseover',function(d){
        let id = d.id;
        let edNeeded = educationValue.find(ele => {return ele.fips === id})
        let persentage = edNeeded.bachelorsOrHigher;
        document.getElementById('tooltip').innerHTML = `<p>${edNeeded['area_name']} :${edNeeded['state']} ${persentage}% </p>` ;
        document.getElementById('tooltip').setAttribute('data-education',persentage);
         document.getElementById('tooltip').style.visibility = "visible";
        document.addEventListener('mousemove',function(e){
            console.log(e)
            document.getElementById('tooltip').style.top = e.y+'px' ;
            document.getElementById('tooltip').style.left = e.x+10+'px' ;
    })})
    .on('mouseout',function(d){

        document.getElementById('tooltip').style.visibility = "hidden";
        // this.style.border = "none"

    })



console.log(countryValue[0])








}

d3.json(countryUrl)
    .then((data,err)=>{
        if(err) return console.log(err)
        // countryValue = topojson.feature(data,data) ; 
        countryValue = topojson.feature(data,data.objects.counties).features ; 

        d3.json(EducationUrl)
        .then((data2,erro)=>{
            if(erro) return console.log(err)
            educationValue = data2
            AllInFunction();
            // console.log(educationValue[0].fips)
        })

})